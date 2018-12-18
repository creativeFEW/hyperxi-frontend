import { FETCH_USERS_START, FETCH_USERS_STOP } from "../actionTypes";

const initialState = {
  loading: false,
  userList: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case FETCH_USERS_START:
      return {...state, loading: true};
    case FETCH_USERS_STOP:
      return {...state, userList: action.users, loading: false};
    default:
      return state;
  }
}