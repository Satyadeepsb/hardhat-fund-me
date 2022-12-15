const { getNamedAccounts, ethers, network } = require("hardhat")
const { developementChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

developementChains.includes(network.name)
    ? describe.skip
    : describe("FundeMe", async () => {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("allows people to fund and withdraw", async () => {
              const fundTxResponse = await fundMe.fund({
                  value: sendValue,
              })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              await withdrawTxResponse.wait(1)

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
