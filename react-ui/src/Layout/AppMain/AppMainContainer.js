import { connect } from 'react-redux';
import AppMain from './AppMain';
import { withRouter } from "react-router";
const mapStateToPros = (state, ownProps) => {
  const  { loading, loggedIn } = state.app;
  return {
    loading,
    loggedIn
  }
}

const actionCreators = {
}

export default withRouter(connect(mapStateToPros, actionCreators)(AppMain));