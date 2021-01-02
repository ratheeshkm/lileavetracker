import { connect } from 'react-redux';
import Dashborad from './Dashboard';
import { getUserList } from '../../redux/actions/appActions';
import { getLeave, getStatus, getLeaveTypes } from '../../redux/actions/leaveActions';

const mapStateToProps = (state) => {
  const { userList } = state.app;
  const { leave, status, leaveTypes } = state.leaves;
  return {
    userList,
    leave,
    status,
    leaveTypes
  };
};

const actionCreaters = {
  getUserList,
  getLeave,
  getStatus,
  getLeaveTypes
};

export default connect(mapStateToProps, actionCreaters)(Dashborad);
