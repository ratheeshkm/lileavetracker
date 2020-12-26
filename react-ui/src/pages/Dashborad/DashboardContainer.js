import { connect } from 'react-redux';
import Dashborad from './Dashboard';
import { getUserList } from '../../redux/actions/appActions';
import { getLeave, getLeaveStatus } from '../../redux/actions/leaveActions';

const mapStateToProps = (state) => {
	const { userList } = state.app;
	const { leave, status } = state.leaves;
	return {
		userList,
		leave,
		status
	};
}

const actionCreaters = {
	getUserList,
	getLeave,
	getLeaveStatus
}

export default connect(mapStateToProps, actionCreaters)(Dashborad);