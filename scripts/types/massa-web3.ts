// Mock implementation for @massalabs/massa-web3 for development
// This allows the deploy script to be syntax-checked without the actual package

export interface DeployResult {
  operationId: string;
  contractAddress: string;
}

export interface SmartContractDeployParams {
  contractDataBinary: Uint8Array | Buffer;
  maxGas: bigint;
  coins: bigint;
}

export interface SmartContractsAPI {
  deploySmartContract(params: SmartContractDeployParams): Promise<DeployResult>;
}

export interface ClientConfig {
  publicApi: string;
  privateKey: string;
}

export class Client {
  constructor(config: ClientConfig) {
    console.log('Mock Massa client initialized with config:', config);
  }

  smartContracts(): SmartContractsAPI {
    return {
      async deploySmartContract(params: SmartContractDeployParams): Promise<DeployResult> {
        console.log('Mock deployment with params:', params);
        return {
          operationId: 'mock_operation_id_' + Date.now(),
          contractAddress: 'AS12E6N5BFAe5bD9hjgGbGAU6vBJwp6hY3dDDzzv3fgKgvKDZ1234'
        };
      }
    };
  }
}
