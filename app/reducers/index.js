import { combineReducers } from 'redux';
import auth from './auth';
import conditionals from './conditionals';
const reducer = combineReducers({
  auth, conditionals
});

export default reducer;
export * from './auth';
export * from './conditionals';
