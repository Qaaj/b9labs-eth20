import Web3 from 'web3'

class Web3Service {

  constructor() {
    this.web3 = null;
    this.initConnection();
  }

  initConnection(ok,nok){
    if(window.web3){
      console.log("Injected web3 detected");
      this.web3 = new Web3(window.web3.currentProvider)
      if(ok) return ok(this.web3);
    }else{
      console.log('No web3 instance injected -  using http://127.0.0.1:9545');
      const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
      this.web3 = new Web3(provider)
      if(ok) return ok(this.web3)
    }
  }

  get(){
    return new Promise((ok,nok) => {
      // if instantiated, return web3
      if(this.web3) return ok(this.web3)
      // otherwise, initiate again
      this.initConnection(ok,nok);
    })
  }
}

module.exports = new Web3Service();