import {createStore, combineReducers} from 'redux';
import userDetails from '@redux/reducers/userDetails';

const rootReducer = combineReducers({
  userDetails,
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;
