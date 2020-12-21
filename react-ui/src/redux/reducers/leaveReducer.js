import { SET_LEAVE_TYPES, SET_LEAVE, SET_STATUS } from '../actions/types/leaveActionTypes';
import leaveinitialStates from './initialStates/leaveinitialStates';

const appReducer = (state = leaveinitialStates, action) => {
	switch (action.type) {
		case SET_LEAVE_TYPES:
			return {
				...state,
				leaveTypes: action.leaveTypes
			}
		case SET_LEAVE:
			return {
				...state,
				leave: action.leave
			}
		case SET_STATUS:
			return {
				...state,
				status: action.status
			}
		default:
			return state;
	}
}

export default appReducer;