import { SET_LEAVE_TYPES, SET_LEAVE, SET_STATUS } from './types/leaveActionTypes';
import { SET_LOADING } from './types/appActionTypes';
import Q from 'q';
import axios from 'axios';

export const setLoading = (loading) => {
	return {
		type: SET_LOADING,
		loading
	}
}

export const setLeaveTypes = (leaveTypes) => {
	return {
		type: SET_LEAVE_TYPES,
		leaveTypes
	}
}

export const setLeave = (leave) => {
  return {
		type: SET_LEAVE,
		leave
	}
}

export const setStatus = (status) => {
  return {
    type: SET_STATUS,
    status
  }
}

export const getLeave = (data) => {
	return(dispatch, getState) => {
		let defer = Q.defer();
    dispatch(setLoading(true));
    let data = {userid: getState().app.user.id }
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
	}
}

export const getStatus = () => {
	return(dispatch, getState) => {
		let defer = Q.defer();
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
	}
}

export const getLeaveTypes = (data) => {
	return(dispatch, getState) => {
		let defer = Q.defer();
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
	}
}

export const saveLeave = (data) => {
  return(dispatch, getState) => {
    let defer = Q.defer();
    dispatch(setLoading(true));
    let postData = { ...data, userid: getState().app.user.id }
    axios.post('/v1/save-leave', postData)
    .then(result => {
      console.log(result);
      defer.promise(result);
      dispatch(setLoading(false));
    })
    .catch(error => {
      defer.resolve(error);
      dispatch(setLoading(false));
    })
    return defer.promise;
  }
}

