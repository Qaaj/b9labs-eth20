var YouTube = artifacts.require("./YouTube.sol");
var Remittance = artifacts.require("./Remittance.sol");
var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  deployer.deploy(YouTube);
  deployer.deploy(Remittance);
  deployer.deploy(Splitter);
};
