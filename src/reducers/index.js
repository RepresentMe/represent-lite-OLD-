import { combineReducers } from 'redux';

// Reducers
import userReducer from './user-reducer';
import currentFlowReducer from './currentFlow.reducer';

// Combine Reducers
var reducers = combineReducers({
  userState: userReducer,
  currentFlowState: currentFlowReducer,
});

export default reducers;
