import { FETCH_USERS_START, FETCH_USERS_STOP } from '../actionTypes';
import Api from "../../api";

export function fetchUsers() {
  return async dispatch => {
    dispatch({type: FETCH_USERS_START});
    const response = await Api.axios.get('/users');
    if (response) {
      dispatch({type: FETCH_USERS_STOP, users: response.data});
    }
  };
}