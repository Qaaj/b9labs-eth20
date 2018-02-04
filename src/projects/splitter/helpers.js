
module.exports = {

  getLog: (event, tx) => {
    const log = tx.logs.filter(item => item.event === event)[0];
    return log;
  },

  api: (contract) => {
    return {
      pauseContract:  async (sender, paused) => {
        const result = await contract.setPaused(paused, {from : sender});
        return result;
      },

      splitFunds:  async (sender, personA, personB, amount) => {
        const result = await contract.splitFunds(personA, personB, { from: sender, value: amount });
        return result;
      },

      getBalance: async (address) => {
        const result = await contract.balances(address);
        return result;
      },

      withdrawBalance: async (address) => {
        const result = await contract.withdraw({from : address});
        return result;
      }
    }
  }
};