import { connect } from 'react-redux';
import Dashborad from './Dashboard';
import { withRouter } from "react-router";
import { setLoading } from '../../redux/actions/appActions';

const mapStateToProps = (state, ownProps) => {
	return {
	};
}

const actionCreaters = {
}

export default connect(mapStateToProps, actionCreaters)(Dashborad);