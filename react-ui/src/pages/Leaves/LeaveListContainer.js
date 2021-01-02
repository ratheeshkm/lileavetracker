import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ApplyLeave from './LeaveList';
import { setLoading } from '../../redux/actions/appActions';
import {
  getLeave,
  getStatus,
  getLeaveTypes,
  updateLeave,
  getLeaveStatus
} from '../../redux/actions/leaveActions';

const mapStateToProps = (state) => {
  const { loading, user } = state.app;
  const { leave, leaveTypes, status, leaveStatus } = state.leaves;
  return {
    loading,
    leave,
    leaveTypes,
    status,
    leaveStatus,
    user
  };
};

const actionCreaters = {
  setLoading,
  getLeave,
  getStatus,
  getLeaveTypes,
  updateLeave,
  getLeaveStatus
};

export default withRouter(connect(mapStateToProps, actionCreaters)(ApplyLeave));
