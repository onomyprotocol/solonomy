const fs = require('fs');
const ethers = require('ethers');

const ERC20NOM = artifacts.require("./ERC20NOM.sol");
// const Gravity = artifacts.require("./Gravity.sol");l
const BondNOM = artifacts.require("./BondingNOM.sol");

module.exports = function(deployer) {
  deployer.then( async() => {
    await deployer.deploy(ERC20NOM);
    const NOMtoken = await ERC20NOM.deployed()
    console.log('\n*************************************************************************\n')
    console.log(`NOM ERC20 Contract Address: ${NOMtoken.address}`)
    console.log('\n*************************************************************************\n')
    
    /**
    await deployer.deploy(Gravity, NOMtoken.address);
    const gBridge = await Gravity.deployed()
    console.log('\n*************************************************************************\n')
    console.log(`Onomy-Gravity Bridge Contract Address: ${gBridge.address}`)
    console.log('\n*************************************************************************\n')
     */
    
    await deployer.deploy(BondNOM, NOMtoken.address);
    const BondingNOM = await ERC20NOM.deployed()
    let numTokens = ethers.BigNumber.from(10).pow(18).mul('100000000')
    let result = await NOMtoken.transfer(Bonding.address, numTokens.toString());
    console.log('\n*************************************************************************\n')
    console.log(`NOM Bonding Contract Address: ${BondingNOM.address}`)
    console.log('\n*************************************************************************\n')

    const contAddrs = {
      NOMERC20: NOMtoken.address,
      BondingNOM: BondingNOM.address
    }

    const contAddrsJSON = JSON.stringify(contAddrs)
    
    fs.writeFile('NOMAddrs.json', contAddrsJSON, function(err) {
      if (err) {
          console.log(err);
      }
    });
    console.log('\n\n*************************************************************************\n')
    console.log(`Contract address saved to json`)
    console.log('\n*************************************************************************\n')

  });
};