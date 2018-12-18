import { LOGIN_START, LOGIN_STOP } from "../actionTypes";

const initialState = {
  loading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case LOGIN_START :
      return {...state, loading: true};
    case LOGIN_STOP :
      return {...state, loading: false};
    default:
      return state;
  }
}
