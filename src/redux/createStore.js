import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';

// creates the store
export default (rootReducer, web3) => {


  const enhancers = compose(
      window.devToolsExtension ?
          window.devToolsExtension() :
          function (store) {
            return store;
          }
  );

  const middleware = applyMiddleware(thunk);

  const store = createStore(
      rootReducer,
      { settings: { web3 }},
      compose(middleware, enhancers)
  );

  return store
}