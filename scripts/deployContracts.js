// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const { ethers } = hre;

  const NOMtokenArtifact = await ethers.getContractFactory("ERC20NOM");
  const NOMtoken = await NOMtokenArtifact.deploy();

  await NOMtoken.deployed();

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

  const BondNOMArtifact = await ethers.getContractFactory("BondingNOM");
  const BondingNOM = await BondNOMArtifact.deploy(NOMtoken.address);

  await BondingNOM.deployed();

  let numTokens = ethers.BigNumber.from(10).pow(18).mul('100000000')
  let result = await NOMtoken.transfer(BondingNOM.address, numTokens.toString());
  let balance = await NOMtoken.balanceOf(BondingNOM.address)
  console.log('\n*************************************************************************\n')
  console.log(`NOM Bonding Contract Address: ${BondingNOM.address}`)
  console.log(`NOM Bonding Contract NOM Balance: ${balance}`)
  console.log('\n*************************************************************************\n')

  const contAddrs = {
    NOMERC20: NOMtoken.address,
    BondingNOM: BondingNOM.address
  }

  const contAddrsJSON = JSON.stringify(contAddrs)

  fs.writeFile('../otrust/src/context/chain/NOMAddrs.json', contAddrsJSON, function(err) {
    if (err) {
        console.log(err);
    }
  });

  fs.copyFile('./build/contracts/BondingNOM.json', '../otrust/src/context/chain/BondingNOM.json', function(err) {
    if (err) {
        console.log(err);
    }
  });

  fs.copyFile('./build/contracts/ERC20NOM.json', '../otrust/src/context/chain/ERC20NOM.json', function(err) {
    if (err) {
        console.log(err);
    }
  });

  console.log('\n\n*************************************************************************\n')
  console.log(`Contract address saved to json`)
  console.log('\n*************************************************************************\n');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
