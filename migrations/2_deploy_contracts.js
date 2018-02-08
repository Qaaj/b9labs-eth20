// var CrowdFunding = artifacts.require("./CrowdFunding.sol");
// var Youtube = artifacts.require("./Youtube.sol");
// var Splitter = artifacts.require("./Splitter.sol");
var Remittance = artifacts.require("./Remittance.sol");

module.exports = function(deployer) {
  // deployer.deploy(CrowdFunding);
  // deployer.deploy(Youtube);
  // deployer.deploy(Splitter);
  deployer.deploy(Remittance);
};
