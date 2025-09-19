import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const HEDERA_RPC_URL = process.env.HEDERA_RPC_URL as string;
const OPERATOR_KEY = process.env.OPERATOR_KEY as string;

if (!HEDERA_RPC_URL || !OPERATOR_KEY) {
  throw new Error("Please set HEDERA_RPC_URL and PRIVATE_KEY in your .env file");
}


const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
   testnet: {
      type: "http",              // 👈 Required in Hardhat 3+
      url: HEDERA_RPC_URL,
      accounts: [OPERATOR_KEY],   // Must be an array
    },
    // testnet: {
    //   type: "http",
    //   url: configVariable("HEDERA_RPC_URL"),
    //   accounts: [configVariable("PRIVATE_KEY")]
    // }
  },
};

export default config;
