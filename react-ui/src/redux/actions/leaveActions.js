import Q from 'q';
import axios from 'axios';
import {
  SET_LEAVE_TYPES,
  SET_LEAVE,
  SET_STATUS,
  SET_LEAVE_STATUS,
  SET_LEAVE_REPORT
} from './types/leaveActionTypes';
import { SET_LOADING } from './types/appActionTypes';

export const setLoading = (loading) => {
  return {
    type: SET_LOADING,
    loading
  };
};

export const setLeaveTypes = (leaveTypes) => {
  return {
    type: SET_LEAVE_TYPES,
    leaveTypes
  };
};

export const setLeave = (leave) => {
  return {
    type: SET_LEAVE,
    leave
  };
};

export const setLeaveReport = (leaves) => {
  return {
    type: SET_LEAVE_REPORT,
    leaves
  };
};

export const setStatus = (status) => {
  return {
    type: SET_STATUS,
    status
  };
};

export const setLeaveStatus = (leaveStatus) => {
  return {
    type: SET_LEAVE_STATUS,
    leaveStatus
  };
};

export const getLeave = () => {
  return (dispatch, getState) => {
    const defer = Q.defer();
    dispatch(setLoading(true));
    const { id, type } = getState().app.user;
    const data = { userid: id, userType: type };
    axios
      .post('/v1/get-leave', data)
      .then((result) => {
        defer.resolve(result.data);
        dispatch(setLeave(result.data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        defer.resolve(error);
        dispatch(setLoading(false));
      });
    return defer.promise;
  };
};

export const getStatus = () => {
  return (dispatch, getState) => {
    const defer = Q.defer();
    dispatch(setLoading(true));
    axios
      .get('/v1/get-status')
      .then((result) => {
        defer.resolve(result.data);
        dispatch(setStatus(result.data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        defer.resolve(error);
        dispatch(setLoading(false));
      });
    return defer.promise;
  };
};

export const getLeaveTypes = (data) => {
  return (dispatch, getState) => {
    const defer = Q.defer();
    dispatch(setLoading(true));
    axios
      .get('/v1/get-leave-types', data)
      .then((result) => {
        defer.resolve(result.data);
        dispatch(setLeaveTypes(result.data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        defer.resolve(error);
        dispatch(setLoading(false));
      });
    return defer.promise;
  };
};

export const getLeaveStatus = () => {
  return (dispatch, getState) => {
    const defer = Q.defer();
    dispatch(setLoading(true));
    axios
      .get('/v1/get-leave-status')
      .then((result) => {
        defer.resolve(result.data);
        dispatch(setLeaveStatus(result.data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        defer.resolve(error);
        dispatch(setLoading(false));
      });
    return defer.promise;
  };
};

export const saveLeave = (data) => {
  return (dispatch, getState) => {
    const defer = Q.defer();
    dispatch(setLoading(true));
    const postData = { ...data, userid: getState().app.user.id };
    axios
      .post('/v1/save-leave', postData)
      .then((result) => {
        defer.promise(result);
        dispatch(setLoading(false));
      })
      .catch((error) => {
        defer.resolve(error);
        dispatch(setLoading(false));
      });
    return defer.promise;
  };
};

export const updateLeave = (data) => {
  return function (dispatch) {
    const defer = Q.defer();
    dispatch(setLoading(true));
    axios
      .post('/v1/update-leave', data)
      .then((result) => {
        dispatch(setLoading(false));
        dispatch(getLeave());
        defer.promise(result);
      })
      .catch((error) => {
        defer.resolve(error);
        dispatch(setLoading(false));
      });
    return defer.promise;
  };
};

export const getLeaveReport = (data) => {
  return (dispatch, getState) => {
    const defer = Q.defer();
    const { id, type } = getState().app.user;
    let params = { ...data, userid: id, userType: type };
    dispatch(setLoading(true));
    axios
      .post('/v1/get-leave-report', params)
      .then((result) => {
        dispatch(setLeaveReport(result.data));
        dispatch(setLoading(false));
        defer.resolve(result.data);
      })
      .catch((error) => {
        defer.resolve(error);
        dispatch(setLoading(false));
      });
    return defer.promise;
  };
};
