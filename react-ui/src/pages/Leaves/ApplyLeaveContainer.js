import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ApplyLeave from './ApplyLeave';
import { getLeaveTypes, saveLeave } from '../../redux/actions/leaveActions';

const mapStateToProps = (state, ownProps) => {
  const { loading } = state.app;
  const { leaveTypes, leave, leaveStatus } = state.leaves;
  return {
    loading,
    leaveTypes,
    leave,
    leaveStatus
  };
};

const actionCreaters = {
  getLeaveTypes,
  saveLeave
};

export default withRouter(connect(mapStateToProps, actionCreaters)(ApplyLeave));
