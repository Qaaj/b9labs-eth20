
module.exports = {

  getLog: (event, tx) => {
    const log = tx.logs.filter(item => item.event === event)[0];
    return log;
  },

  api: (contract) => {
    return {
      hashPassword:  async (password) => {
        const result = await contract.hashPassword(password);
        return result;
      },

      newProject:  async (pass_one, pass_two, blockHeight, txObject) => {
        const result = await contract.newProject(pass_one, pass_two, blockHeight, txObject);
        return result;
      },
    }
  }
};