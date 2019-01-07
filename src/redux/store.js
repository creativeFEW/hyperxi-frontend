import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import DevTools from '../devtools/devtools';
import thunk from 'redux-thunk';
import * as selectors from './selectors';
import * as ReselectTools from 'reselect-tools';

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk), DevTools.instrument()
));

ReselectTools.getStateWith(() => store.getState());
ReselectTools.registerSelectors(selectors);

export default store;