import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import Web3 from './services/web3';

import App from './App'
import createStore from './redux/index'
import { injectGlobal } from 'styled-components';


/* eslint-disable no-unused-expressions */

injectGlobal`
  html,body{
    background-color: #546E7A;
    font-family: Roboto;
    color: white; 
  }
`;

Web3.get().then((web3) => {

  const store = createStore(web3);

  ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
  );
});