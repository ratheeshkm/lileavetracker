import { connect } from 'react-redux';
import UserBox from './UserBox';
import { withRouter } from "react-router";
import { setLoading, setLogout, reset } from '../../../redux/actions/appActions';

const mapStateToPros = (state, ownProps) => {
	const { user } = state.app;
	return {
		user
	}
}

const actionCreators = {
	setLoading,
	setLogout,
	reset
}

export default withRouter(connect(mapStateToPros, actionCreators)(UserBox));