import { SET_LOGIN_TOKEN, SET_CLIENT_DETAILS, SET_RESTAURANT_DETAILS } from '../actions/types/clientActionTypes';
import userInitalState from './initialStates/clientInitialStates';

const userReducer = (state = userInitalState, action) => {
	switch (action.type) {
		case SET_LOGIN_TOKEN:
			return {
				...state,
				loginToken: action.loginToken
			}
		case SET_CLIENT_DETAILS:
			return {
				...state,
				...action.clientDetails
			}
		case SET_RESTAURANT_DETAILS: 
			return {
				...state,
				restaurantDetails: action.restaurantDetails
			}
		default:
			return state;
	}
}

export default userReducer;