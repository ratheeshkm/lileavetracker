import Q from 'q';
import axios from 'axios';
import {
  SET_LOADING,
  SET_LOGGED_IN,
  SET_LOG_OUT,
  SET_LOGIN_STEP,
  SET_USER,
  SET_USER_LIST,
  RESET
} from './types/appActionTypes';

export const setLoading = (loading) => {
  return {
    type: SET_LOADING,
    loading
  };
};

export const setLoginStep = (loginStep) => {
  return {
    type: SET_LOGIN_STEP,
    loginStep
  };
};

export const setLoggedIn = (loggedIn) => {
  return {
    type: SET_LOGGED_IN,
    loggedIn
  };
};

export const setLogout = () => {
  return {
    type: SET_LOG_OUT
  };
};

export const setUser = (user) => {
  return {
    type: SET_USER,
    user
  };
};

export const reset = () => {
  return {
    type: RESET
  };
};

export const generatePassword = (data) => {
  return (dispatch, getState) => {
    const defer = Q.defer();
    dispatch(setLoading(true));
    axios
      .post('/v1/generate-password', data)
      .then((result) => {
        defer.resolve(result.data);
        dispatch(setUser(result.data[0]));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        defer.resolve(error);
        dispatch(setLoading(false));
      });
    return defer.promise;
  };
};

export const passwordLogin = (data) => {
  return (dispatch, getState) => {
    const defer = Q.defer();
    dispatch(setLoading(true));
    axios
      .post('/v1/password-login', data)
      .then((result) => {
        defer.resolve(result.data);
        // dispatch(setLoggedIn(true));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        defer.resolve(error);
        dispatch(setLoading(false));
      });
    return defer.promise;
  };
};

export const setUserList = (userList) => {
  return {
    type: SET_USER_LIST,
    userList
  };
};

export const getUserList = () => {
  return (dispatch) => {
    const defer = Q.defer();
    axios
      .get('/v1/get-user-list')
      .then((result) => {
        dispatch(setUserList(result.data));
      })
      .catch((error) => {
        defer.resolve(error);
      });
    return defer.promise;
  };
};
