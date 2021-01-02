import { connect } from 'react-redux';
import Nav from "./VerticalNavWrapper";

const mapStateToProps = (state, ownProps) => {
  const { user } = state.app;
  return {
    user
  };
};

const actionCreaters = {
};

export default connect(mapStateToProps, actionCreaters)(Nav);
