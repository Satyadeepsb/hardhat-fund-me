require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

const GOERIL_RPC_URL =
    process.env.GOERIL_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHER_SCAN_API_KEY = process.env.ETHER_SCAN_API_KEY || "0xkey"
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: GOERIL_RPC_URL,
            accounts: [PRIVATE_KEY], // Metamask Account's PRIVATE_KEY
            chainId: 5,
            blockConformations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    // solidity: "0.8.17",
    solidity: {
        compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
    },
    etherscan: {
        apiKey: ETHER_SCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD", // INR
        coinmarketcap: COINMARKETCAP_API_KEY, // https://coinmarketcap.com/api
        token: "ETH", // Ethereum:ETH (default), Binance:BNB, Polygon:MATIC, Avalanche:AVAX, Heco:HT, Moonriver:MOVR
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}
