import { web3 } from '@hicaru/bearby.js';

// Environment variables
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

/**
 * Check if Bearby wallet is installed and available
 */
export function isBearbyInstalled(): boolean {
  return web3.wallet.installed;
}

/**
 * Check if wallet is connected
 */
export function isWalletConnected(): boolean {
  return web3.wallet.connected;
}

/**
 * Connect to Bearby wallet
 */
export async function connectWallet(): Promise<boolean> {
  try {
    if (!web3.wallet.installed) {
      throw new Error('Bearby wallet is not installed. Please install it from https://bearby.io/');
    }

    const connected = await web3.wallet.connect();
    if (connected) {
      console.log('Connected to Bearby wallet!');
      console.log('Current address:', web3.wallet.account.base58);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
}

/**
 * Disconnect from Bearby wallet
 */
export async function disconnectWallet(): Promise<boolean> {
  try {
    return await web3.wallet.disconnect();
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    throw error;
  }
}

/**
 * Get current wallet address
 */
export function getCurrentAddress(): string | null {
  if (!web3.wallet.connected) {
    return null;
  }
  return web3.wallet.account.base58;
}

/**
 * Create a new subscription plan
 * @param price - Price per billing cycle in smallest units (nanomass)
 * @param interval - Billing interval in milliseconds  
 * @param token - Token address (empty string for MAS)
 * @returns Plan ID
 */
export async function createPlan(price: bigint, interval: number, token: string): Promise<number> {
  if (!web3.wallet.connected) {
    throw new Error('Wallet not connected. Please connect your Bearby wallet first.');
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured. Please deploy the contract first.');
  }

  try {
    const txHash = await web3.contract.call({
      fee: 0,
      maxGas: 2_000_000,
      coins: 0,
      targetAddress: CONTRACT_ADDRESS,
      functionName: 'createPlan',
      parameters: [
        {
          type: web3.contract.types.U64,
          value: price.toString()
        },
        {
          type: web3.contract.types.U64, 
          value: interval.toString()
        },
        {
          type: web3.contract.types.STRING,
          value: token
        }
      ]
    });

    console.log('Plan creation transaction hash:', txHash);
    
    // TODO: Parse events to get the actual plan ID
    // For now, return a mock ID - this should be parsed from contract events
    return Date.now() % 10000;
    
  } catch (error) {
    console.error('Failed to create plan:', error);
    throw error;
  }
}

/**
 * Subscribe to a plan
 * @param planId - Plan ID to subscribe to
 * @returns Subscription ID
 */
export async function subscribe(planId: number): Promise<number> {
  if (!web3.wallet.connected) {
    throw new Error('Wallet not connected. Please connect your Bearby wallet first.');
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured. Please deploy the contract first.');
  }

  try {
    const txHash = await web3.contract.call({
      fee: 0,
      maxGas: 2_000_000,
      coins: 0,
      targetAddress: CONTRACT_ADDRESS,
      functionName: 'subscribe',
      parameters: [
        {
          type: web3.contract.types.U64,
          value: planId.toString()
        }
      ]
    });

    console.log('Subscription transaction hash:', txHash);
    
    // TODO: Parse events to get the actual subscription ID
    return Date.now() % 10000;
    
  } catch (error) {
    console.error('Failed to subscribe:', error);
    throw error;
  }
}

/**
 * Cancel a subscription
 * @param subscriptionId - Subscription ID to cancel
 */
export async function cancelSubscription(subscriptionId: number): Promise<void> {
  if (!web3.wallet.connected) {
    throw new Error('Wallet not connected. Please connect your Bearby wallet first.');
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured. Please deploy the contract first.');
  }

  try {
    const txHash = await web3.contract.call({
      fee: 0,
      maxGas: 2_000_000,
      coins: 0,
      targetAddress: CONTRACT_ADDRESS,
      functionName: 'cancelSubscription',
      parameters: [
        {
          type: web3.contract.types.U64,
          value: subscriptionId.toString()
        }
      ]
    });

    console.log('Cancellation transaction hash:', txHash);
    
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
}

/**
 * Get plan details
 * @param planId - Plan ID
 * @returns Plan data
 */
export async function getPlan(planId: number): Promise<any> {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured. Please deploy the contract first.');
  }

  try {
    const data = await web3.contract.readSmartContract({
      fee: 0,
      maxGas: 200_000,
      simulatedGasPrice: 0,
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'getPlan',
      parameter: [
        {
          type: web3.contract.types.U64,
          value: planId.toString()
        }
      ]
    });

    return JSON.parse(data);
    
  } catch (error) {
    console.error('Failed to get plan:', error);
    throw error;
  }
}

/**
 * Get subscription details
 * @param subscriptionId - Subscription ID
 * @returns Subscription data
 */
export async function getSubscription(subscriptionId: number): Promise<any> {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured. Please deploy the contract first.');
  }

  try {
    const data = await web3.contract.readSmartContract({
      fee: 0,
      maxGas: 200_000,
      simulatedGasPrice: 0,
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'getSubscription',
      parameter: [
        {
          type: web3.contract.types.U64,
          value: subscriptionId.toString()
        }
      ]
    });

    return JSON.parse(data);
    
  } catch (error) {
    console.error('Failed to get subscription:', error);
    throw error;
  }
}

/**
 * Create a new subscription plan (mock implementation)
 */
export async function createPlan(
  price: bigint,
  interval: bigint,
  token: string
): Promise<bigint> {
  console.log('Mock createPlan called with:', { price, interval, token });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock return value
  return BigInt(Math.floor(Math.random() * 1000) + 1);
}

/**
 * Subscribe to a plan (mock implementation)
 */
export async function subscribe(planId: bigint): Promise<bigint> {
  console.log('Mock subscribe called with planId:', planId);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock return value
  return BigInt(Math.floor(Math.random() * 1000) + 1);
}

/**
 * Cancel a subscription (mock implementation)
 */
export async function cancelSubscription(subId: bigint): Promise<void> {
  console.log('Mock cancelSubscription called with subId:', subId);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
}

/**
 * Get plan details (mock implementation)
 */
export async function getPlan(planId: bigint): Promise<any> {
  console.log('Mock getPlan called with planId:', planId);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock return value
  return {
    id: planId,
    creator: '0x1234567890123456789012345678901234567890',
    price: BigInt(1000000),
    interval: BigInt(30 * 24 * 60 * 60 * 1000),
    token: 'MAS',
    isActive: true,
  };
}

/**
 * Get subscription details (mock implementation)
 */
export async function getSubscription(subId: bigint): Promise<any> {
  console.log('Mock getSubscription called with subId:', subId);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock return value
  return {
    id: subId,
    planId: BigInt(1),
    subscriber: '0x4567890123456789012345678901234567890123',
    isActive: true,
    nextPaymentTime: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: BigInt(Date.now() - 23 * 24 * 60 * 60 * 1000),
    paymentCount: BigInt(0),
  };
}

/**
 * Get total number of plans (mock implementation)
 */
export async function getPlanCount(): Promise<bigint> {
  console.log('Mock getPlanCount called');
  return BigInt(3); // Mock value
}

/**
 * Get total number of subscriptions (mock implementation)
 */
export async function getSubscriptionCount(): Promise<bigint> {
  console.log('Mock getSubscriptionCount called');
  return BigInt(2); // Mock value
}

/**
 * Format interval from milliseconds to human readable string
 */
export function formatInterval(intervalMs: bigint): string {
  const ms = Number(intervalMs);
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Convert time string to milliseconds
 */
export function timeToMilliseconds(value: number, unit: string): bigint {
  const multipliers: { [key: string]: number } = {
    'seconds': 1000,
    'minutes': 60 * 1000,
    'hours': 60 * 60 * 1000,
    'days': 24 * 60 * 60 * 1000,
    'weeks': 7 * 24 * 60 * 60 * 1000,
    'months': 30 * 24 * 60 * 60 * 1000,
  };

  return BigInt(value * (multipliers[unit] || 1000));
}
