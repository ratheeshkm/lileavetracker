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
import { getUserList } from '../../redux/actions/appActions';

const mapStateToProps = (state) => {
  const { loading, user, userList } = state.app;
  const { leave, leaveTypes, status, leaveStatus } = state.leaves;
  return {
    loading,
    leave,
    leaveTypes,
    status,
    leaveStatus,
    user,
    userList
  };
};

const actionCreaters = {
  setLoading,
  getLeave,
  getStatus,
  getLeaveTypes,
  updateLeave,
  getLeaveStatus,
  getUserList
};

export default withRouter(connect(mapStateToProps, actionCreaters)(ApplyLeave));
