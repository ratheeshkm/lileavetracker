import { combineReducers } from 'redux';
import app from './appReducer';
import ThemeOptions from '../../reducers/ThemeOptions';
import leaves from './leaveReducer';

const combinedReducer = combineReducers({
  ThemeOptions,
  app,
  leaves
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export default rootReducer;
