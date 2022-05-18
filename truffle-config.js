require('babel-register');
require('babel-polyfill');
require('dotenv').config();  //injecting environment variable into truffle contract


module.exports = {
 

  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  },

  

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',

  // Configure your compilers
  compilers: {
    solc: {
     optimizer: {
       enabled: true,
       runs: 200
     }
    }
  }
}
