const fs = require('fs')
const HDWalletProvider = require('truffle-hdwallet-provider')

let hdwallet = null
if (process.env.npm_lifecycle_event === 'migrate:ropsten') {
  try {
    // const mnemonic = fs
    //   .readFileSync(process.env.HDWALLET_PATH)
    //   .toString()
    //   .trim()
    console.log('Ropsten detected');
    const mnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';
    hdwallet = new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/');
  } catch (error) {
    console.error(`can't import key from : "${process.env.HDWALLET}" `, error)
  }
}

console.log(hdwallet);

module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: 5777
    },

    testrpc: {
      host: 'localhost',
      port: 9545,
      network_id: "*"
    },
    amazon: {
      host: '52.39.44.21',
      port: 8545,
      network_id: 144,
      gas: 4712388,
    },
    dev: {
      host: 'localhost',
      port: 8545,
      network_id: 1
    },
    docker: {
      host: 'geth',
      port: 8545,
      network_id: 1
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      provider: hdwallet,
      network_id: 3,
      gas: 3712388
    },
    kovan: {
      host: "localhost",
      port: 8545,
      network_id: 42,
      gas: 4500000
    }
  }
};
