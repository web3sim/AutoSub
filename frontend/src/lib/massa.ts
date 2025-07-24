import { web3 } from '@hicaru/bearby.js';

// Contract configuration - replace with actual deployed contract address
const CONTRACT_ADDRESS = 'AS12BqZEQ6sByhRLyEuf0YbQmcF2PsDdkNNG1akBJu9XcjZA1eT'; // Replace with actual contract address

// Contract function names
export const CONTRACT_FUNCTIONS = {
  CREATE_PLAN: 'createPlan',
  SUBSCRIBE: 'subscribe',
  CANCEL_SUBSCRIPTION: 'cancelSubscription',
  GET_PLANS: 'getPlans',
  GET_SUBSCRIPTIONS: 'getSubscriptions',
  GET_PLAN_DETAILS: 'getPlanDetails',
  UPDATE_PLAN: 'updatePlan',
  WITHDRAW_EARNINGS: 'withdrawEarnings'
} as const;

// Types for subscription plans and data
export interface SubscriptionPlan {
  id: number;
  creatorAddress: string;
  name: string;
  description: string;
  price: number; // in nanoMAS
  duration: number; // in milliseconds
  isActive: boolean;
}

export interface UserSubscription {
  id: number;
  planId: number;
  subscriberAddress: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
}

// Wallet functions
export const isBearbyInstalled = (): boolean => {
  try {
    return web3.wallet.installed;
  } catch (error) {
    console.error('Error checking Bearby installation:', error);
    return false;
  }
};

export const isWalletConnected = (): boolean => {
  try {
    return web3.wallet.connected;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};

export const connectWallet = async (): Promise<string | null> => {
  try {
    if (!isBearbyInstalled()) {
      throw new Error('Bearby wallet is not installed. Please install the Bearby extension from the Chrome Web Store.');
    }

    console.log('Attempting wallet connection...');
    
    const connected = await web3.wallet.connect();
    console.log('Connection result:', connected);
    
    if (connected && web3.wallet.account?.base58) {
      const address = web3.wallet.account.base58;
      console.log('Wallet connected successfully:', address);
      return address;
    }

    console.warn('Connection failed or no account available');
    return null;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

export const disconnectWallet = async (): Promise<void> => {
  try {
    await web3.wallet.disconnect();
    console.log('Wallet disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
};

export const getWalletAddress = (): string | null => {
  try {
    if (!isWalletConnected()) return null;
    return web3.wallet.account?.base58 || null;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return null;
  }
};

// Alias for backwards compatibility
export const getCurrentAddress = getWalletAddress;

// Helper function to call smart contract
const callContract = async (
  functionName: string,
  parameters: any[] = [],
  coins: number = 0
): Promise<string> => {
  try {
    if (!isWalletConnected()) {
      throw new Error('Wallet not connected');
    }

    console.log('Calling contract function:', functionName, 'with parameters:', parameters);

    // Convert parameters to the correct format for Bearby
    const formattedParams = parameters.map((param) => {
      if (typeof param === 'string') {
        return {
          type: web3.contract.types.STRING,
          value: param
        };
      } else if (typeof param === 'number') {
        return {
          type: web3.contract.types.U64,
          value: param
        };
      } else if (typeof param === 'boolean') {
        return {
          type: web3.contract.types.BOOL,
          value: param
        };
      } else {
        // Default to string representation
        return {
          type: web3.contract.types.STRING,
          value: String(param)
        };
      }
    });

    // Call the smart contract using Bearby Web3
    const txHash = await web3.contract.call({
      fee: 0, // Transaction fee
      maxGas: 2000000, // Maximum gas for the function call
      coins: coins, // Coins to attach to the function call
      targetAddress: CONTRACT_ADDRESS, // Contract address
      functionName: functionName, // Function to call
      parameters: formattedParams // Function parameters
    });

    console.log('Transaction hash:', txHash);
    return txHash;

  } catch (error) {
    console.error('Error calling contract:', error);
    throw error;
  }
};

// Helper function to read from smart contract (no transaction required)
const readContract = async (
  functionName: string,
  parameters: any[] = []
): Promise<any> => {
  try {
    console.log('Reading from contract function:', functionName, 'with parameters:', parameters);

    // Convert parameters to the correct format for Bearby
    const formattedParams = parameters.map((param) => {
      if (typeof param === 'string') {
        return {
          type: web3.contract.types.STRING,
          value: param
        };
      } else if (typeof param === 'number') {
        return {
          type: web3.contract.types.U64,
          value: param
        };
      } else if (typeof param === 'boolean') {
        return {
          type: web3.contract.types.BOOL,
          value: param
        };
      } else {
        return {
          type: web3.contract.types.STRING,
          value: String(param)
        };
      }
    });

    // Read from the smart contract using Bearby Web3
    const result = await web3.contract.readSmartContract({
      fee: 0, // No fee for read operations
      maxGas: 200000, // Maximum gas for the read operation
      targetAddress: CONTRACT_ADDRESS, // Contract address
      targetFunction: functionName, // Function to call
      parameter: formattedParams // Function parameters
    });

    console.log('Read result:', result);
    return result;

  } catch (error) {
    console.error('Error reading from contract:', error);
    // For now, return mock data if contract read fails
    return getMockData(functionName, parameters);
  }
};

// Fallback mock data for development when contract is not deployed
const getMockData = (functionName: string, parameters: any[]): any => {
  console.log('Using mock data for:', functionName);
  
  switch (functionName) {
    case CONTRACT_FUNCTIONS.GET_PLANS:
      return generateMockPlans();
    
    case CONTRACT_FUNCTIONS.GET_SUBSCRIPTIONS:
      return generateMockSubscriptions();
    
    case CONTRACT_FUNCTIONS.GET_PLAN_DETAILS:
      return generateMockPlanDetails(parameters[0]);
    
    default:
      return null;
  }
};

// Mock data generators for development when contract is not deployed
const generateMockPlans = (): SubscriptionPlan[] => [
  {
    id: 1,
    creatorAddress: 'AS1234...abcd',
    name: 'Basic Plan',
    description: 'Access to basic content',
    price: 1000000000, // 1 MAS in nanoMAS
    duration: 30 * 24 * 60 * 60 * 1000, // 30 days
    isActive: true
  },
  {
    id: 2,
    creatorAddress: 'AS1234...abcd',
    name: 'Premium Plan',
    description: 'Access to premium content and features',
    price: 3000000000, // 3 MAS in nanoMAS
    duration: 30 * 24 * 60 * 60 * 1000, // 30 days
    isActive: true
  }
];

const generateMockSubscriptions = (): UserSubscription[] => [
  {
    id: 1,
    planId: 1,
    subscriberAddress: 'AS5678...efgh',
    startTime: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
    endTime: Date.now() + (20 * 24 * 60 * 60 * 1000), // 20 days from now
    isActive: true
  }
];

const generateMockPlanDetails = (planId: number): SubscriptionPlan | null => {
  const plans = generateMockPlans();
  return plans.find(plan => plan.id === planId) || null;
};

// Public API functions
export const createPlan = async (
  name: string,
  description: string,
  price: number,
  duration: number
): Promise<{ planId: bigint }> => {
  await callContract(CONTRACT_FUNCTIONS.CREATE_PLAN, [name, description, price, duration]);
  console.log('Plan creation transaction submitted');
  // For now, return a generated ID since we can't extract it from the transaction immediately
  // In a real implementation, you would listen for events or query the contract state
  return { planId: BigInt(Date.now()) };
};

export const subscribeToPlan = async (planId: number): Promise<{ subscriptionId: bigint }> => {
  // Calculate plan cost (this should come from the plan details)
  const planDetails = await getPlanDetails(planId);
  const planCost = planDetails ? planDetails.price : 0;
  
  await callContract(CONTRACT_FUNCTIONS.SUBSCRIBE, [planId], planCost);
  console.log('Subscription transaction submitted');
  return { subscriptionId: BigInt(Date.now()) };
};

export const cancelSubscription = async (subscriptionId: number): Promise<{ success: boolean }> => {
  await callContract(CONTRACT_FUNCTIONS.CANCEL_SUBSCRIPTION, [subscriptionId]);
  console.log('Cancellation transaction submitted');
  return { success: true };
};

export const getPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    return await readContract(CONTRACT_FUNCTIONS.GET_PLANS);
  } catch (error) {
    console.warn('Contract read failed, using mock data:', error);
    return getMockData(CONTRACT_FUNCTIONS.GET_PLANS, []);
  }
};

export const getUserSubscriptions = async (): Promise<UserSubscription[]> => {
  try {
    return await readContract(CONTRACT_FUNCTIONS.GET_SUBSCRIPTIONS);
  } catch (error) {
    console.warn('Contract read failed, using mock data:', error);
    return getMockData(CONTRACT_FUNCTIONS.GET_SUBSCRIPTIONS, []);
  }
};

export const getPlanDetails = async (planId: number): Promise<SubscriptionPlan | null> => {
  try {
    return await readContract(CONTRACT_FUNCTIONS.GET_PLAN_DETAILS, [planId]);
  } catch (error) {
    console.warn('Contract read failed, using mock data:', error);
    return getMockData(CONTRACT_FUNCTIONS.GET_PLAN_DETAILS, [planId]);
  }
};

export const updatePlan = async (
  planId: number,
  name: string,
  description: string,
  price: number,
  isActive: boolean
): Promise<{ success: boolean }> => {
  await callContract(CONTRACT_FUNCTIONS.UPDATE_PLAN, [planId, name, description, price, isActive]);
  console.log('Plan update transaction submitted');
  return { success: true };
};

export const withdrawEarnings = async (): Promise<{ success: boolean }> => {
  await callContract(CONTRACT_FUNCTIONS.WITHDRAW_EARNINGS);
  console.log('Withdrawal transaction submitted');
  return { success: true };
};

// Utility functions
export const formatMASAmount = (nanoMAS: number): string => {
  return (nanoMAS / 1_000_000_000).toFixed(2);
};

export const parseMASAmount = (masAmount: string): number => {
  return Math.floor(parseFloat(masAmount) * 1_000_000_000);
};

export const formatDuration = (milliseconds: number): string => {
  const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
  return `${days} day${days !== 1 ? 's' : ''}`;
};

export const timeToMilliseconds = (amount: number, unit: string): number => {
  switch (unit) {
    case 'days':
      return amount * 24 * 60 * 60 * 1000;
    case 'weeks':
      return amount * 7 * 24 * 60 * 60 * 1000;
    case 'months':
      return amount * 30 * 24 * 60 * 60 * 1000; // Approximate
    case 'years':
      return amount * 365 * 24 * 60 * 60 * 1000; // Approximate
    default:
      return amount;
  }
};
