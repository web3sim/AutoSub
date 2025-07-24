import { web3 } from '@hicaru/bearby.js';

// Types for our subscription system
export interface SubscriptionPlan {
  id: string;
  creator: string;
  price: bigint;
  interval: number;
  token: string;
  active: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  subscriber: string;
  startTime: number;
  lastPayment: number;
  active: boolean;
}

// Check if Bearby wallet is installed
export const isBearbyInstalled = (): boolean => {
  return typeof window !== 'undefined' && web3.wallet.installed;
};

// Check if wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  try {
    if (!isBearbyInstalled()) return false;
    return web3.wallet.connected;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};

// Connect to Bearby wallet
export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!isBearbyInstalled()) {
      throw new Error('Bearby wallet is not installed. Please install the Bearby browser extension.');
    }

    // Request connection
    const connected = await web3.wallet.connect();
    
    if (connected && web3.wallet.account.base58) {
      return web3.wallet.account.base58;
    } else {
      throw new Error('Failed to connect to wallet');
    }
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = async (): Promise<void> => {
  try {
    await web3.wallet.disconnect();
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
};

// Get current connected address
export const getCurrentAddress = async (): Promise<string | null> => {
  try {
    if (!isBearbyInstalled() || !web3.wallet.connected) return null;
    return web3.wallet.account.base58 || null;
  } catch (error) {
    console.error('Error getting current address:', error);
    return null;
  }
};

// Create a new subscription plan
export const createPlan = async (
  price: bigint,
  interval: number,
  token: string
): Promise<string> => {
  try {
    if (!isBearbyInstalled() || !web3.wallet.connected) {
      throw new Error('Bearby wallet is not connected');
    }

    // Mock transaction hash for testing
    const mockTxHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Mock plan creation transaction:', mockTxHash);
    console.log('Plan details:', { price: price.toString(), interval, token });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockTxHash;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
};

// Subscribe to a plan
export const subscribe = async (planId: string): Promise<string> => {
  try {
    if (!isBearbyInstalled() || !web3.wallet.connected) {
      throw new Error('Bearby wallet is not connected');
    }

    // Get plan details first
    const plan = await getPlan(planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Mock transaction for now
    const mockTxHash = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Mock subscription transaction:', mockTxHash);
    console.log('Subscribing to plan:', planId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockTxHash;
  } catch (error) {
    console.error('Error subscribing to plan:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string): Promise<string> => {
  try {
    if (!isBearbyInstalled() || !web3.wallet.connected) {
      throw new Error('Bearby wallet is not connected');
    }

    // Mock transaction for now
    const mockTxHash = `cancel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Mock cancellation transaction:', mockTxHash);
    console.log('Cancelling subscription:', subscriptionId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockTxHash;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

// Get plan details (mock data for now)
export const getPlan = async (planId: string): Promise<SubscriptionPlan | null> => {
  try {
    // Mock plans for testing
    const mockPlans: { [key: string]: SubscriptionPlan } = {
      '1': {
        id: '1',
        creator: 'AS1234567890abcdef1234567890abcdef1234567890abcdef12',
        price: BigInt('5000000'), // 5 MAS (6 decimals)
        interval: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        token: 'MAS',
        active: true
      },
      '2': {
        id: '2',
        creator: 'AS1234567890abcdef1234567890abcdef1234567890abcdef12',
        price: BigInt('10000000'), // 10 MAS
        interval: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        token: 'MAS',
        active: true
      },
      '3': {
        id: '3',
        creator: 'AS9876543210fedcba9876543210fedcba9876543210fedcba98',
        price: BigInt('2500000'), // 2.5 MAS
        interval: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        token: 'MAS',
        active: true
      }
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockPlans[planId] || null;
  } catch (error) {
    console.error('Error getting plan:', error);
    return null;
  }
};

// Get subscription details (mock data for now)
export const getSubscription = async (subscriptionId: string): Promise<Subscription | null> => {
  try {
    const userAddress = await getCurrentAddress();
    
    // Mock subscriptions for testing
    const mockSubscriptions: { [key: string]: Subscription } = {
      '1': {
        id: '1',
        planId: '1',
        subscriber: userAddress || 'AS1234567890abcdef1234567890abcdef1234567890abcdef12',
        startTime: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
        lastPayment: Date.now() - (5 * 24 * 60 * 60 * 1000),
        active: true
      },
      '2': {
        id: '2', 
        planId: '2',
        subscriber: userAddress || 'AS1234567890abcdef1234567890abcdef1234567890abcdef12',
        startTime: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
        lastPayment: Date.now() - (2 * 24 * 60 * 60 * 1000),
        active: true
      }
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockSubscriptions[subscriptionId] || null;
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
};

// Get all plans (mock data for listing)
export const getAllPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    // Return all mock plans
    const plans = [
      await getPlan('1'),
      await getPlan('2'),
      await getPlan('3')
    ];
    
    return plans.filter(plan => plan !== null) as SubscriptionPlan[];
  } catch (error) {
    console.error('Error getting all plans:', error);
    return [];
  }
};

// Get user's subscriptions (mock data for now)
export const getUserSubscriptions = async (userAddress: string): Promise<Subscription[]> => {
  try {
    // Return mock subscriptions for the user
    const subscriptions = [
      await getSubscription('1'),
      await getSubscription('2')
    ];
    
    return subscriptions.filter(sub => sub !== null && sub.subscriber === userAddress) as Subscription[];
  } catch (error) {
    console.error('Error getting user subscriptions:', error);
    return [];
  }
};

// Helper function to convert time intervals to milliseconds
export const timeToMilliseconds = (value: number, unit: string): number => {
  const multipliers = {
    'minutes': 60 * 1000,
    'hours': 60 * 60 * 1000,
    'days': 24 * 60 * 60 * 1000,
    'weeks': 7 * 24 * 60 * 60 * 1000,
    'months': 30 * 24 * 60 * 60 * 1000, // Approximate
  };
  
  return value * (multipliers[unit as keyof typeof multipliers] || multipliers.days);
};

// Helper function to format price for display
export const formatPrice = (price: bigint, decimals: number = 6): string => {
  const divisor = BigInt(10 ** decimals);
  const wholePart = price / divisor;
  const fractionalPart = price % divisor;
  
  if (fractionalPart === 0n) {
    return wholePart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return `${wholePart}.${trimmedFractional}`;
};

// Helper function to format time interval for display
export const formatInterval = (intervalMs: number): string => {
  const seconds = Math.floor(intervalMs / 1000);
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
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
};
