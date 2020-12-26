import React, { Fragment, useEffect } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';
import { Row, Col } from 'reactstrap';
import PageTitle from '../../Layout/AppMain/PageTitle';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment)
const formatDate = date => {
    let splitedDate = date.split("-");
    return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
}

const Dashborad = (props) => {
    const { getUserList, getLeave, leave, getLeaveStatus, status } = props;
    useEffect(() => {
      getUserList();
    }, [getUserList])

    useEffect(() => {
      getLeave();
      getLeaveStatus();
    }, [getLeave, getLeaveStatus]);
    
    const leaveList = leave.map(item => {
        let { id, startdate, enddate, description } = item;
        return {
            id,
            title: description,
            allDay: true,
            start: new Date(formatDate(startdate)),
            end: new Date(formatDate(enddate)),
            status: status.filter(statusItem => statusItem.id === item.status)[0].name
        }
    });
    console.log("leave--->", leaveList)
    const customDayPropGetter = date => {
    if (date.getDay() === 6 || date.getDay() === 0)
        return {
            style: {
                backgroundColor: '#e6e6e6'
            },
        }
        else return {}
    }
    
    function Event({ event }) {
        return (
            <span>
                <strong>{event.title}</strong>
                {event.desc && ':  ' + event.desc}
                {event.status === 'Applied' && <span> - <b>{event.status.toUpperCase()}</b></span>}
                {event.status === 'Approved' && <span className="text-success"> - <b>{event.status.toUpperCase()}</b></span>}
                {event.status === 'Rejected' && <span className="text-error"> - <b>{event.status.toUpperCase()}</b></span>}
            </span>
        )
    }
   
    console.log("status-->", status)
    return (
		<Fragment>
			<AppHeader />
			<div className="app-main">
				<AppSidebar />
				<div className="app-main__outer">
					<div className="app-main__inner">
					<ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <PageTitle
                            heading="Dashboard"
                            subheading="Gives you insights of your business"
                            icon="pe-7s-home icon-gradient bg-mean-fruit"
                        />
                        <Row>
                            <Col md="12" lg="12">
                                <Row>
                                    <Col>
                                    <Calendar
                                        localizer={localizer}
                                        events={leaveList}
                                        startAccessor="start"
                                        endAccessor="end"
                                        style={{ height: 600 }}
                                        dayPropGetter={customDayPropGetter}
                                        components={{
                                            event: Event
                                        }}
                                        />
                                    </Col>
                                    
                                </Row>
                            </Col>
                        </Row>
                        
                    </div>
                </ReactCSSTransitionGroup>
					</div>
					<AppFooter />
				</div>
			</div>
		</Fragment>
	)
}

export default Dashborad;