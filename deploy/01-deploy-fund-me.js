//import
//main function
//calling main function

const { network } = require("hardhat")

// function deployFunc() {
//     console.log("HELLO")
// }

// module.exports.default = deployFunc

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
}
