
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { reducer } from './Reducer'

const enhancer = compose(applyMiddleware(thunk, logger));
const store = createStore(reducer, enhancer);
export default store;