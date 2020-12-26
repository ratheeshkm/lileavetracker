import { connect } from 'react-redux';
import Report from './Report';
import { setLoading } from '../../redux/actions/appActions';
import { getLeave, getStatus, getLeaveTypes, updateLeave, getLeaveStatus, getLeaveReport } from '../../redux/actions/leaveActions';

const mapStateToProps = (state) => {
  const { loading, user, userList } = state.app;
  const { leave, leaveTypes, status, leaveStatus, leaveReport } = state.leaves;
  return {
    loading,
    leave,
    leaveTypes,
    status,
    leaveStatus,
    user,
    leaveReport,
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
  getLeaveReport
};

export default connect(mapStateToProps, actionCreaters)(Report)
