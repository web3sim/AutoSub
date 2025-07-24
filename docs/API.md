# AutoSub Smart Contract API

This document describes the API for the AutoSub smart contract deployed on Massa Network.

## Contract Address

The contract address will be set after deployment. Check your `.env` file or deployment logs.

## Functions

### createPlan(price: u64, interval: u64, token: string): u64

Creates a new subscription plan.

**Parameters:**
- `price`: Price per billing cycle in the smallest token unit
- `interval`: Billing interval in milliseconds
- `token`: Token address (empty string for MAS)

**Returns:** Plan ID

**Events:** `PlanCreated(planId, creator, price, interval, token)`

**Example:**
```typescript
// Create a plan for 1 MAS every 30 days
const planId = await createPlan(
  1000000n,  // 1 MAS (6 decimals)
  2592000000n,  // 30 days in milliseconds
  "MAS"
);
```

### subscribe(planId: u64): u64

Subscribe to an existing plan.

**Parameters:**
- `planId`: ID of the plan to subscribe to

**Returns:** Subscription ID

**Events:** `SubscriptionCreated(subId, planId, subscriber, nextPayment)`

**Example:**
```typescript
const subscriptionId = await subscribe(1n);
```

### executePayment(subId: u64): void

Execute a scheduled payment (called automatically by deferred calls).

**Parameters:**
- `subId`: Subscription ID to process payment for

**Events:** `PaymentExecuted(subId, amount, timestamp)`

### cancelSubscription(subId: u64): void

Cancel an active subscription.

**Parameters:**
- `subId`: Subscription ID to cancel

**Authorization:** Only subscriber or plan creator can cancel

**Events:** `SubscriptionCancelled(subId, reason)`

**Example:**
```typescript
await cancelSubscription(1n);
```

### getPlan(planId: u64): string

Get plan details.

**Parameters:**
- `planId`: Plan ID

**Returns:** JSON string with plan data

**Example:**
```typescript
const planData = JSON.parse(await getPlan(1n));
console.log(planData.price, planData.interval);
```

### getSubscription(subId: u64): string

Get subscription details.

**Parameters:**
- `subId`: Subscription ID

**Returns:** JSON string with subscription data

**Example:**
```typescript
const subData = JSON.parse(await getSubscription(1n));
console.log(subData.isActive, subData.nextPaymentTime);
```

### getPlanCount(): u64

Get total number of plans created.

**Returns:** Total plan count

### getSubscriptionCount(): u64

Get total number of subscriptions created.

**Returns:** Total subscription count

## Data Structures

### Plan

```typescript
interface Plan {
  id: u64;
  creator: string;
  price: u64;
  interval: u64;
  token: string;
  isActive: boolean;
}
```

### Subscription

```typescript
interface Subscription {
  id: u64;
  planId: u64;
  subscriber: string;
  isActive: boolean;
  nextPaymentTime: u64;
  createdAt: u64;
  paymentCount: u64;
}
```

## Events

The contract emits events for important actions:

- `PlanCreated`: When a new plan is created
- `SubscriptionCreated`: When someone subscribes to a plan
- `PaymentExecuted`: When a scheduled payment is processed
- `SubscriptionCancelled`: When a subscription is cancelled

## Error Handling

The contract will throw errors for:

- Invalid plan IDs
- Inactive plans
- Unauthorized operations
- Insufficient balances
- Invalid parameters

## Gas Considerations

- Plan creation: ~500,000 gas
- Subscription: ~800,000 gas (includes deferred call scheduling)
- Payment execution: ~300,000 gas
- Cancellation: ~200,000 gas
- Read operations: ~50,000 gas

## Security Notes

1. **Deferred Calls**: Payments are automatically executed using Massa's deferred call system
2. **Authorization**: Only plan creators and subscribers can cancel subscriptions
3. **Token Support**: Currently only MAS token is fully implemented
4. **Storage**: All data is stored on-chain for transparency

## Integration Examples

See the frontend code in `src/lib/massa.ts` for integration examples using the Massa Web3 library.
