import {REDUX} from '@constants';

export function userDetails(obj) {
  return {
    type: REDUX.USER_DETAILS,
    payload: obj,
  };
}
