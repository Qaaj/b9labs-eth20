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
    color: white; 
  }
`;

// Prints out current build # in console;
console.log(`Version: ${version}`);

Web3.get().then((web3) => {
  const store = createStore(web3);

  ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
  );
}).catch(err => {
  ReactDOM.render(
      <div>Something went wrong fetching your Web3 instance.</div>,
      <div>{err}</div>,
      document.getElementById('root')
  );
});
