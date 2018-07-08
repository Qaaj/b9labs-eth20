import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import Web3 from './services/web3';

import App from './App'
import createStore from './redux/index'
import { injectGlobal } from 'styled-components';
import version from './version';

/* eslint-disable no-unused-expressions */

injectGlobal`
  html,body{
    background-color: #546E7A;
    font-family: Roboto;
    //color: white; 
    margin: 0px;
    padding: 0px;
  }
`;

// Prints out current build # in console;
console.log(`Version: ${version}`);
Web3.get('http://localhost:9545').then((web3) => {

  window._web3 = web3;
  const store = createStore(web3);

  ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
  );
});