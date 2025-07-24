import {
  Storage,
  generateEvent,
  Context,
  createCall,
  transferCoins,
  Args,
  u64ToBytes,
  bytesToU64,
  stringToBytes,
  bytesToString,
  u64,
  bool,
  json
} from '../types/massa-sc-std';

// Helper function for byte concatenation
function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}

// Storage keys
const PLAN_COUNT_KEY = stringToBytes('plan_count');
const SUBSCRIPTION_COUNT_KEY = stringToBytes('subscription_count');
const PLAN_PREFIX = stringToBytes('plan_');
const SUBSCRIPTION_PREFIX = stringToBytes('subscription_');
const USER_SUBSCRIPTIONS_PREFIX = stringToBytes('user_subs_');

// Data structures
@json
class Plan {
  id: u64;
  creator: string;
  price: u64;
  interval: u64; // in milliseconds
  token: string;
  isActive: bool;

  constructor(
    id: u64,
    creator: string,
    price: u64,
    interval: u64,
    token: string
  ) {
    this.id = id;
    this.creator = creator;
    this.price = price;
    this.interval = interval;
    this.token = token;
    this.isActive = true;
  }
}

@json
class Subscription {
  id: u64;
  planId: u64;
  subscriber: string;
  isActive: bool;
  nextPaymentTime: u64;
  createdAt: u64;
  paymentCount: u64;

  constructor(
    id: u64,
    planId: u64,
    subscriber: string,
    nextPaymentTime: u64
  ) {
    this.id = id;
    this.planId = planId;
    this.subscriber = subscriber;
    this.isActive = true;
    this.nextPaymentTime = nextPaymentTime;
    this.createdAt = Context.timestamp();
    this.paymentCount = 0;
  }
}

/**
 * Create a new subscription plan
 * @param price - Price per billing cycle in tokens
 * @param interval - Billing interval in milliseconds
 * @param token - Token address for payments (empty string for MAS)
 * @returns Plan ID
 */
export function createPlan(price: u64, interval: u64, token: string): u64 {
  // Get current plan count
  let planCount: u64 = 0;
  if (Storage.has(PLAN_COUNT_KEY)) {
    planCount = bytesToU64(Storage.get(PLAN_COUNT_KEY));
  }

  // Increment plan count
  planCount++;
  
  // Create new plan
  const plan = new Plan(
    planCount,
    Context.caller(),
    price,
    interval,
    token
  );

  // Store plan
  const planKey = concatBytes(PLAN_PREFIX, u64ToBytes(planCount));
  Storage.set(planKey, stringToBytes(JSON.stringify(plan)));
  
  // Update plan count
  Storage.set(PLAN_COUNT_KEY, u64ToBytes(planCount));

  // Generate event
  generateEvent(`PlanCreated:${planCount}:${Context.caller()}:${price}:${interval}:${token}`);

  return planCount;
}

/**
 * Subscribe to a plan
 * @param planId - ID of the plan to subscribe to
 * @returns Subscription ID
 */
export function subscribe(planId: u64): u64 {
  // Get plan
  const planKey = concatBytes(PLAN_PREFIX, u64ToBytes(planId));
  if (!Storage.has(planKey)) {
    throw new Error('Plan does not exist');
  }

  const planData = JSON.parse(bytesToString(Storage.get(planKey))) as Plan;
  if (!planData.isActive) {
    throw new Error('Plan is not active');
  }

  // Get current subscription count
  let subCount: u64 = 0;
  if (Storage.has(SUBSCRIPTION_COUNT_KEY)) {
    subCount = bytesToU64(Storage.get(SUBSCRIPTION_COUNT_KEY));
  }

  // Increment subscription count
  subCount++;

  // Calculate next payment time
  const nextPaymentTime = Context.timestamp() + planData.interval;

  // Create subscription
  const subscription = new Subscription(
    subCount,
    planId,
    Context.caller(),
    nextPaymentTime
  );

  // Store subscription
  const subKey = concatBytes(SUBSCRIPTION_PREFIX, u64ToBytes(subCount));
  Storage.set(subKey, stringToBytes(JSON.stringify(subscription)));

  // Update subscription count
  Storage.set(SUBSCRIPTION_COUNT_KEY, u64ToBytes(subCount));

  // Schedule first payment using deferred call
  schedulePayment(subCount, nextPaymentTime);

  // Process immediate payment
  processPayment(planData, Context.caller());

  // Generate event
  generateEvent(`SubscriptionCreated:${subCount}:${planId}:${Context.caller()}:${nextPaymentTime}`);

  return subCount;
}

/**
 * Execute a scheduled payment (called by deferred calls)
 * @param subId - Subscription ID to process payment for
 */
export function executePayment(subId: u64): void {
  // Get subscription
  const subKey = concatBytes(SUBSCRIPTION_PREFIX, u64ToBytes(subId));
  if (!Storage.has(subKey)) {
    throw new Error('Subscription does not exist');
  }

  const subData = JSON.parse(bytesToString(Storage.get(subKey))) as Subscription;
  if (!subData.isActive) {
    throw new Error('Subscription is not active');
  }

  // Get plan
  const planKey = concatBytes(PLAN_PREFIX, u64ToBytes(subData.planId));
  if (!Storage.has(planKey)) {
    throw new Error('Plan does not exist');
  }

  const planData = JSON.parse(bytesToString(Storage.get(planKey))) as Plan;
  if (!planData.isActive) {
    // Cancel subscription if plan is inactive
    cancelSubscription(subId);
    return;
  }

  // Process payment
  processPayment(planData, subData.subscriber);

  // Update subscription
  subData.nextPaymentTime = Context.timestamp() + planData.interval;
  subData.paymentCount++;
  Storage.set(subKey, stringToBytes(JSON.stringify(subData)));

  // Schedule next payment
  schedulePayment(subId, subData.nextPaymentTime);

  // Generate event
  generateEvent(`PaymentExecuted:${subId}:${planData.price}:${Context.timestamp()}`);
}

/**
 * Cancel a subscription
 * @param subId - Subscription ID to cancel
 */
export function cancelSubscription(subId: u64): void {
  // Get subscription
  const subKey = concatBytes(SUBSCRIPTION_PREFIX, u64ToBytes(subId));
  if (!Storage.has(subKey)) {
    throw new Error('Subscription does not exist');
  }

  const subData = JSON.parse(bytesToString(Storage.get(subKey))) as Subscription;
  
  // Check authorization (only subscriber or plan creator can cancel)
  const planKey = concatBytes(PLAN_PREFIX, u64ToBytes(subData.planId));
  const planData = JSON.parse(bytesToString(Storage.get(planKey))) as Plan;
  
  if (Context.caller() !== subData.subscriber && Context.caller() !== planData.creator) {
    throw new Error('Unauthorized to cancel subscription');
  }

  // Update subscription status
  subData.isActive = false;
  Storage.set(subKey, stringToBytes(JSON.stringify(subData)));

  // Generate event
  generateEvent(`SubscriptionCancelled:${subId}:${Context.caller()}`);
}

/**
 * Get plan details
 * @param planId - Plan ID
 * @returns Plan data as JSON string
 */
export function getPlan(planId: u64): string {
  const planKey = concatBytes(PLAN_PREFIX, u64ToBytes(planId));
  if (!Storage.has(planKey)) {
    throw new Error('Plan does not exist');
  }

  return bytesToString(Storage.get(planKey));
}

/**
 * Get subscription details
 * @param subId - Subscription ID
 * @returns Subscription data as JSON string
 */
export function getSubscription(subId: u64): string {
  const subKey = concatBytes(SUBSCRIPTION_PREFIX, u64ToBytes(subId));
  if (!Storage.has(subKey)) {
    throw new Error('Subscription does not exist');
  }

  return bytesToString(Storage.get(subKey));
}

/**
 * Get total number of plans
 * @returns Total plan count
 */
export function getPlanCount(): u64 {
  if (!Storage.has(PLAN_COUNT_KEY)) {
    return 0;
  }
  return bytesToU64(Storage.get(PLAN_COUNT_KEY));
}

/**
 * Get total number of subscriptions
 * @returns Total subscription count
 */
export function getSubscriptionCount(): u64 {
  if (!Storage.has(SUBSCRIPTION_COUNT_KEY)) {
    return 0;
  }
  return bytesToU64(Storage.get(SUBSCRIPTION_COUNT_KEY));
}

// Helper functions

/**
 * Schedule a payment using deferred calls
 * @param subId - Subscription ID
 * @param executionTime - When to execute the payment
 */
function schedulePayment(subId: u64, executionTime: u64): void {
  const args = new Args();
  args.add(subId);
  
  createCall(
    Context.contractAddress(),
    'executePayment',
    args,
    0, // No coins to transfer for the call itself
    executionTime
  );
}

/**
 * Process payment from subscriber to plan creator
 * @param plan - Plan details
 * @param subscriber - Subscriber address
 */
function processPayment(plan: Plan, subscriber: string): void {
  // TODO: Implement token transfer logic
  // For now, we'll handle MAS transfers only
  if (plan.token === '' || plan.token === 'MAS') {
    // Transfer MAS coins
    transferCoins(stringToBytes(plan.creator), plan.price);
  } else {
    // TODO: Implement ERC20-like token transfer
    // This would require calling the token contract's transfer function
    throw new Error('Token transfers not yet implemented');
  }
}
