import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';

// creates the store
export default (rootReducer) => {


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
      {},
      compose(middleware, enhancers)
  );

  return store
}