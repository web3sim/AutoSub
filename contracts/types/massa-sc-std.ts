// Mock implementation for @massalabs/massa-sc-std
// This allows development without the actual Massa package

// AssemblyScript-like types
export type u64 = number;
export type bool = boolean;

// Mock decorator for JSON serialization
export function json(constructor: Function): void {
  // No-op for mock implementation
}

// Helper function for concatenating byte arrays (exported at the end)
function concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}

// Helper function for concatenating byte arrays
export function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  return concatUint8Arrays(a, b);
}

// Mock Massa Storage interface
export const Storage = {
  _storage: new Map<string, Uint8Array>(),
  
  has(key: Uint8Array): boolean {
    const keyStr = Array.from(key).join(',');
    return this._storage.has(keyStr);
  },
  
  get(key: Uint8Array): Uint8Array {
    const keyStr = Array.from(key).join(',');
    const value = this._storage.get(keyStr);
    if (!value) {
      throw new Error('Key not found in storage');
    }
    return value;
  },
  
  set(key: Uint8Array, value: Uint8Array): void {
    const keyStr = Array.from(key).join(',');
    this._storage.set(keyStr, value);
  }
};

// Mock Context interface
export const Context = {
  caller(): string {
    return 'AU12E6N5BFAe5bD9hjgGbGAU6vBJwp6hY3dDDzzv3fgKgvKDZ1234';
  },
  
  timestamp(): u64 {
    return Date.now();
  },
  
  contractAddress(): string {
    return 'AS12E6N5BFAe5bD9hjgGbGAU6vBJwp6hY3dDDzzv3fgKgvKDZ5678';
  }
};

// Mock Args class
export class Args {
  private _args: any[] = [];
  
  add(value: any): void {
    this._args.push(value);
  }
}

// Mock functions
export function generateEvent(event: string): void {
  console.log('Event:', event);
}

export function createCall(
  address: string,
  function_name: string,
  args: Args,
  coins: u64,
  execution_time?: u64
): void {
  console.log('Deferred call:', { address, function_name, coins, execution_time });
}

export function transferCoins(to: Uint8Array, amount: u64): void {
  console.log('Transfer coins:', { to: bytesToString(to), amount });
}

export function u64ToBytes(value: u64): Uint8Array {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, BigInt(value), true); // little-endian
  return new Uint8Array(buffer);
}

export function bytesToU64(bytes: Uint8Array): u64 {
  const view = new DataView(bytes.buffer, bytes.byteOffset, 8);
  return Number(view.getBigUint64(0, true)); // little-endian
}

export function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function bytesToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}
