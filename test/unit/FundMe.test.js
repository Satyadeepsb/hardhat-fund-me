const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") // 1000000000000000000 // 1 ETH
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

        it("updated the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            console.log(`response.toString() ${response.toString()}`)
            console.log(`sendValue.toString() ${sendValue.toString()}`)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Add funder to array of funders", async function () {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0)
            assert.equal(funder, deployer)
        })
    })
})
