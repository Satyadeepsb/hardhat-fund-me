//import
//main function
//calling main function

const { network } = require("hardhat")
const {
    networkConfig,
    deploymentChains,
    developementChains,
} = require("../helper-hardhat-config")

// function deployFunc() {
//     console.log("HELLO")
// }

// module.exports.default = deployFunc

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is X use address Y
    // if chainId is Z use address A
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developementChains.includes(network.name)) {
        // to ge latest deployed contract use `deployments.get`
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    // if the contract doesn't exist, we deploy minimal version of it
    // for our local testing
    // when going for localhost or hardhat network we want to use mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // put price feed address
        log: true,
    })
    log("------------------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
