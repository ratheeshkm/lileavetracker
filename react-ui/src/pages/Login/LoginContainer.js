import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Login from './Login';
import {
  setLoading,
  generatePassword,
  setLoginStep,
  passwordLogin,
  setLoggedIn
} from '../../redux/actions/appActions';

const mapStateToPros = (state, ownProps) => {
  const { loading, loggedIn, loginStep, user } = state.app;
  return {
    loading,
    loggedIn,
    loginStep,
    user
  };
};

const actionCreators = {
  setLoading,
  generatePassword,
  setLoginStep,
  passwordLogin,
  setLoggedIn
};

export default withRouter(connect(mapStateToPros, actionCreators)(Login));
