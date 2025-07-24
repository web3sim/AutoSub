// Mock data for development and testing

export interface Plan {
  id: bigint;
  creator: string;
  price: bigint;
  interval: bigint;
  token: string;
  isActive: boolean;
}

export interface Subscription {
  id: bigint;
  planId: bigint;
  subscriber: string;
  isActive: boolean;
  nextPaymentTime: bigint;
  createdAt: bigint;
  paymentCount: bigint;
}

// Mock plans for development
export const mockPlans: Plan[] = [
  {
    id: BigInt(1),
    creator: '0x1234567890123456789012345678901234567890',
    price: BigInt(1000000), // 1 MAS (assuming 6 decimals)
    interval: BigInt(30 * 24 * 60 * 60 * 1000), // 30 days in milliseconds
    token: 'MAS',
    isActive: true,
  },
  {
    id: BigInt(2),
    creator: '0x2345678901234567890123456789012345678901',
    price: BigInt(500000), // 0.5 MAS
    interval: BigInt(7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
    token: 'MAS',
    isActive: true,
  },
  {
    id: BigInt(3),
    creator: '0x3456789012345678901234567890123456789012',
    price: BigInt(2000000), // 2 MAS
    interval: BigInt(365 * 24 * 60 * 60 * 1000), // 365 days in milliseconds
    token: 'MAS',
    isActive: true,
  },
];

// Mock subscriptions for development
export const mockSubscriptions: Subscription[] = [
  {
    id: BigInt(1),
    planId: BigInt(1),
    subscriber: '0x4567890123456789012345678901234567890123',
    isActive: true,
    nextPaymentTime: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: BigInt(Date.now() - 23 * 24 * 60 * 60 * 1000), // 23 days ago
    paymentCount: BigInt(0),
  },
  {
    id: BigInt(2),
    planId: BigInt(2),
    subscriber: '0x4567890123456789012345678901234567890123',
    isActive: true,
    nextPaymentTime: BigInt(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdAt: BigInt(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    paymentCount: BigInt(0),
  },
];

/**
 * Get mock plan by ID
 */
export function getMockPlan(id: bigint): Plan | undefined {
  return mockPlans.find(plan => plan.id === id);
}

/**
 * Get mock subscriptions by subscriber address
 */
export function getMockSubscriptionsByUser(subscriber: string): Subscription[] {
  return mockSubscriptions.filter(sub => sub.subscriber === subscriber);
}

/**
 * Get mock subscription by ID
 */
export function getMockSubscription(id: bigint): Subscription | undefined {
  return mockSubscriptions.find(sub => sub.id === id);
}

/**
 * Format price for display
 */
export function formatPrice(price: bigint, token: string): string {
  // Assuming 6 decimals for MAS token
  const decimals = 6;
  const divisor = BigInt(10 ** decimals);
  const wholePart = price / divisor;
  const fracPart = price % divisor;
  
  if (fracPart === BigInt(0)) {
    return `${wholePart} ${token}`;
  }
  
  const fracStr = fracPart.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${wholePart}.${fracStr} ${token}`;
}

/**
 * Format date for display
 */
export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get time remaining until next payment
 */
export function getTimeUntilPayment(nextPaymentTime: bigint): string {
  const now = Date.now();
  const nextPayment = Number(nextPaymentTime);
  const diff = nextPayment - now;
  
  if (diff <= 0) {
    return 'Payment due';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
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
 * Truncate address for display
 */
export function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
