import { setLoading, setLoggedIn } from './appActions';
import Q from 'q';
import { SET_LOGIN_TOKEN, SET_CLIENT_DETAILS, SET_RESTAURANT_DETAILS } from './types/clientActionTypes';
import axios from 'axios';

export const setLoginToken = (loginToken) => {
	return {
		type: SET_LOGIN_TOKEN,
		loginToken
	};
}

export const setClientDetails = (clientDetails) => {
	return {
		type: SET_CLIENT_DETAILS,
		clientDetails
	};
}

export const setRestaurantDetails = (restaurantDetails) => {
	return {
		type: SET_RESTAURANT_DETAILS,
		restaurantDetails
	}
}

export const setLogin = (values) => {
	return (dispatch, getState) => {
		let defer = Q.defer();
		dispatch(setLoading(true));
		let { userName , password } = values;
		let postData = {
			"username" : userName,
			"password" : password,
		}
		axios.post("http://localhost:5000/pos/v1/login", postData)
		.then((result)=> {
			defer.resolve(result.data);
			dispatch(setLoading(false));
			if(result.data.rowCount) {
				let clientDetails = {
					clientId: result.data.result[0].clientid,
					name: result.data.result[0].name
				};
				dispatch(getRestaurantDetails(result.data.result[0].clientid));
				dispatch(setClientDetails(clientDetails));
			}
		})
		.catch((error)=> {
			console.log("Error", error);
			defer.resolve(error);
			dispatch(setLoading(false));
			dispatch(setLoggedIn(false));
		})
		return defer.promise;
	}
}

export const addRestaurantDetails = (data) => {
	return (dispatch, getState) => {
		data = {...data, clientid: getState().client.clientId }
		let defer = Q.defer();
		axios.post("http://localhost:5000/pos/v1/add-restaurant-details", data)
		.then((result) => {
			defer.resolve(result.data);
			let clientDetails = {
				restaurantName: data.restName,
				country: data.country,
				currency: data.currency,
				noOfRooms: data.noOfRooms,
				noOfFloors: data.noOfFloors
			};
			dispatch(setClientDetails(clientDetails));
		})
		.catch((error) => {
			console.log("Error", error);
			defer.resolve(error);
		})
		return defer.promise;
	}
}

export const getRestaurantDetails = (data) => {
	return (dispatch, getState) => {
		let defer = Q.defer();
		let clientId = (data) ? { clientid: data} : ''
		axios.post("http://localhost:5000/pos/v1/get-restaurant-details", clientId)
		.then((result) => {
			console.log(result)
			if(result.data.results.length) {
				let clientDetails = {
					restaurantName: result.data.results[0]['business-name'],
					country: result.data.results[0].country,
					currency: result.data.results[0].currency,
					noOfRooms: result.data.results[0]['no-of-floor'],
					noOfFloors: result.data.results[0]['no-of-rooms']
				};
				dispatch(setClientDetails(clientDetails));
			}
			defer.resolve(result.data.results);
			dispatch(setRestaurantDetails(result.data.results));
			dispatch(setLoggedIn(true));
		})
		.catch((error) => {
			console.log("Error", error);
			defer.resolve(error);
		})
		return defer.promise;
	}
}