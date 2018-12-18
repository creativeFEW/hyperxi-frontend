import { LOGIN_START, LOGIN_STOP } from '../actionTypes';
import Api from "../../api";

export function login({email, password, history}) {
  return async dispatch => {
    dispatch({type: LOGIN_START});
    let response;
    try {
      response = await Api.axios.post('/users/login', {
        email,
        password
      });
    } catch (err) {
    } finally {
      dispatch({type: LOGIN_STOP});
    }
    if (response) {
      console.log('[Auth Actions] Received data from server', response.data);
      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExp', response.data.expiration);
      history.push('/invoices')
    }
  };
}

export function logout({history}) {
  return async dispatch => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExp');
    history.push('/')
  };
}
