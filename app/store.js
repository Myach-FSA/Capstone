import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import createLogger from 'redux-logger'; // https://github.com/evgenyrodionov/redux-logger
import thunkMiddleware from 'redux-thunk'; // https://github.com/gaearon/redux-thunk

export default createStore(reducer, applyMiddleware(thunkMiddleware, createLogger()));
