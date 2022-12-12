const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    beforeEach(async function () {
        // deploy our FundMe contract
        // using Hardhat-deploy

        // will give us accounts provided in hardhat config networks
        // const accounts = await ethers.getSigner()
        // const accountZero = accounts[0]

        deployer = (await getNamedAccounts()).deployer
        // to run all testcases with tags
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        // getContract will give us latest deployed "FundMe" contract
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
    })
})
