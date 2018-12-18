import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import DevTools from '../devtools';
import thunk from 'redux-thunk';

export default createStore(rootReducer, compose(
  applyMiddleware(thunk), DevTools.instrument()
));