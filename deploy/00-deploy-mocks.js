const { network } = require("hardhat")
const {
    networkConfig,
    developementChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log(`network.name ${network.name}`)
    if (developementChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            from: deployer,
            contract: "MockV3Aggregator",
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed successfully!!")
        log("---------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
