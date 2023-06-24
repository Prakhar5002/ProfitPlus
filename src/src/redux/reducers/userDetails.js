import {REDUX} from '@constants';

const initialState = {};

export default (state = initialState, action) => {
  const data = action.payload;
  switch (action.type) {
    case REDUX.USER_DETAILS:
      return {
        ...state,
        data,
      };
    default:
      return state;
  }
};
