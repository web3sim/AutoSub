// Mock type definitions for @massalabs/massa-sc-std
// This allows development without the actual Massa package

// AssemblyScript-like types
declare type u64 = number;
declare type bool = boolean;

// Mock decorator for JSON serialization
declare function json(constructor: Function): void;

// Extended Uint8Array with concat method
declare class MassaBytes extends Uint8Array {
  concat(other: Uint8Array): MassaBytes;
}

// Mock Massa Storage interface
declare namespace Storage {
  function has(key: Uint8Array): boolean;
  function get(key: Uint8Array): Uint8Array;
  function set(key: Uint8Array, value: Uint8Array): void;
}

// Mock Context interface
declare namespace Context {
  function caller(): string;
  function timestamp(): u64;
  function contractAddress(): string;
}

// Mock Args class
declare class Args {
  add(value: any): void;
}

// Mock functions
declare function generateEvent(event: string): void;
declare function createCall(
  address: string,
  function_name: string,
  args: Args,
  coins: u64,
  execution_time?: u64
): void;
declare function transferCoins(to: Uint8Array, amount: u64): void;
declare function u64ToBytes(value: u64): MassaBytes;
declare function bytesToU64(bytes: Uint8Array): u64;
declare function stringToBytes(str: string): MassaBytes;
declare function bytesToString(bytes: Uint8Array): string;

export {
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
  json,
  MassaBytes
};
