import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AppMain from './AppMain';

const mapStateToPros = (state, ownProps) => {
  const { loading, loggedIn } = state.app;
  return {
    loading,
    loggedIn
  };
};

const actionCreators = {};

export default withRouter(connect(mapStateToPros, actionCreators)(AppMain));
