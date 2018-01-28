var CrowdFunding = artifacts.require("./CrowdFunding.sol");
var Youtube = artifacts.require("./Youtube.sol");

module.exports = function(deployer) {
  deployer.deploy(CrowdFunding);
  deployer.deploy(Youtube);
};
