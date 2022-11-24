// can use AAVE helper config https://github.com/aave/aave-v3-core/blob/master/helper-hardhat-config.ts

const networkConfig = {
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
}

const developementChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developementChains,
    DECIMALS,
    INITIAL_ANSWER,
}
