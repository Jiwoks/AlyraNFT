const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: 5777,
      skipDryRun: true
    },
    rinkeby: {
      network_id: '4',
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, process.env.RPCRINKEBY,),
      from: process.env.OWNER_ADDRESS
    }
  },
  compilers: {
    solc: {
      version: "0.8.13",
    }
  },
  plugins: ["solidity-coverage"],
};
