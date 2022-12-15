const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developementChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

!developementChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.utils.parseEther("0.01") // 1000000000000000000 // 1 ETH
          beforeEach(async () => {
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

          describe("constructor", async () => {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async () => {
              it("Fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("updated the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  console.log(`response.toString() ${response.toString()}`)
                  console.log(`sendValue.toString() ${sendValue.toString()}`)
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Add funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })

              it("Withdraw ETH from single founder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  console.log(
                      `startingFundMeBalance ${startingFundMeBalance.toString()}`
                  )
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  console.log(
                      `startingDeployerBalance ${startingDeployerBalance.toString()}`
                  )
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  // gasUsed and effectiveGasPrice are BigDecimal use .mul method to multiply instead of *
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  console.log(`gasCost ${gasCost.toString()}`)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  console.log(
                      `endingDeployerBalance ${endingDeployerBalance.toString()}`
                  )
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("Withdraw ETH from single founder using cheaperWithdraw", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  console.log(
                      `startingFundMeBalance ${startingFundMeBalance.toString()}`
                  )
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  console.log(
                      `startingDeployerBalance ${startingDeployerBalance.toString()}`
                  )
                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  // gasUsed and effectiveGasPrice are BigDecimal use .mul method to multiply instead of *
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  console.log(`gasCost ${gasCost.toString()}`)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  console.log(
                      `endingDeployerBalance ${endingDeployerBalance.toString()}`
                  )
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("Withdraw ETH from multiple founder", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  console.log(
                      `startingFundMeBalance ${startingFundMeBalance.toString()}`
                  )
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  console.log(
                      `startingDeployerBalance ${startingDeployerBalance.toString()}`
                  )
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  // gasUsed and effectiveGasPrice are BigDecimal use .mul method to multiply instead of *
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  console.log(`gasCost ${gasCost.toString()}`)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  console.log(
                      `endingDeployerBalance ${endingDeployerBalance.toString()}`
                  )
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
                  // Make sure that the funders are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("Withdraw ETH from multiple founder  using cheaperWithdraw", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  console.log(
                      `startingFundMeBalance ${startingFundMeBalance.toString()}`
                  )
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  console.log(
                      `startingDeployerBalance ${startingDeployerBalance.toString()}`
                  )
                  // Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  // gasUsed and effectiveGasPrice are BigDecimal use .mul method to multiply instead of *
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  console.log(`gasCost ${gasCost.toString()}`)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  console.log(
                      `endingDeployerBalance ${endingDeployerBalance.toString()}`
                  )
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
                  // Make sure that the funders are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted
                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only allows the owner to withdraw funds", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectContract = await fundMe.connect(attacker)
                  await expect(
                      attackerConnectContract.withdraw()
                  ).to.be.revertedWithCustomError(
                      attackerConnectContract,
                      "FundMe__NotOwner"
                  )
              })
          })
      })
