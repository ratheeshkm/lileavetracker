import { connect } from 'react-redux';
import Login from './Login';
import { withRouter } from "react-router";
import { setLoading, generatePassword, setLoginStep, passwordLogin, setLoggedIn } from '../../redux/actions/appActions';
import { setLogin } from '../../redux/actions/clientActions';

const mapStateToPros = (state, ownProps) => {
	const  { loading, loggedIn, loginStep } = state.app;
  return {
	 loading,
	 loggedIn,
	 loginStep
  }
}

const actionCreators = {
	setLoading,
	setLogin,
	generatePassword,
	setLoginStep,
	passwordLogin,
	setLoggedIn
}

export default withRouter(connect(mapStateToPros, actionCreators)(Login));