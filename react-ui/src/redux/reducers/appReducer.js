import { SET_LOADING, SET_LOGGED_IN, SET_LOG_OUT, SET_LOGIN_STEP, SET_USER, SET_USER_LIST} from '../actions/types/appActionTypes';
import appInitialState from './initialStates/appInitialStates';

const appReducer = (state = appInitialState, action) => {
	switch (action.type) {
		case SET_LOADING:
			return {
				...state,
				loading: action.loading
			}
		case SET_LOGGED_IN:
			return {
				...state,
				loggedIn: action.loggedIn
			};
		case SET_LOG_OUT:
			return {
				...state,
				loggedIn: false
			};
		case SET_LOGIN_STEP:
			return {
				...state,
				loginStep:  action.loginStep
			}
		case SET_USER:
			return {
				...state,
				user:  action.user
			}
		case SET_USER_LIST:
			return {
				...state,
				userList:  action.userList
			}
		default:
			return state;
	}
}

export default appReducer;