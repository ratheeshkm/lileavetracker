import { connect } from 'react-redux';
import ApplyLeave from './LeaveList';
import { withRouter } from 'react-router';
import { setLoading } from '../../redux/actions/appActions';
import { getLeave, getStatus } from '../../redux/actions/leaveActions';

const mapStateToProps = (state, ownProps) => {
  const { loading } = state.app;
  const { leave, leaveTypes, status } = state.leaves;
  return {
    loading,
    leave,
    leaveTypes,
    status
  };
};

const actionCreaters = {
  setLoading,
  getLeave,
  getStatus
};

export default withRouter(
  connect(mapStateToProps, actionCreaters)(ApplyLeave)
);
