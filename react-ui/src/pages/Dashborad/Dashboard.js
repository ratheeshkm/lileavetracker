import React, { useEffect } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Row, Col } from 'reactstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';
import PageTitle from '../../Layout/AppMain/PageTitle';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {OverlayTrigger} from 'react-bootstrap';
import {Popover} from 'react-bootstrap';

const localizer = momentLocalizer(moment);
const formatDate = (date) => {
  const splitedDate = date.split('-');
  return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
};

const Dashborad = (props) => {
  const { getUserList, getLeave, leave, getStatus, status, getLeaveTypes, leaveTypes } = props;
  useEffect(() => {
    getUserList();
  }, [getUserList]);

  useEffect(() => {
    getLeave();
    //getLeaveStatus();
    getStatus();
    getLeaveTypes();
  }, [getLeave, getStatus, getLeaveTypes]);

  const leaveList = leave.map((item) => {
    const { id, startdate, enddate, description } = item;
    return {
      id,
      title: description,
      allDay: true,
      start: new Date(formatDate(startdate)),
      end: new Date(formatDate(enddate)),
      status: status.length && status.filter(statusItem => statusItem.id === item.status)[0].name,
      type: leaveTypes.length && leaveTypes.filter(leaveTypes => leaveTypes.id === item.type)[0].name,
    };
  });
  
  const customDayPropGetter = (date) => {
    if (date.getDay() === 6 || date.getDay() === 0)
      return {
        style: {
          backgroundColor: '#e6e6e6'
        }
      };
    return {};
  };

  function Event({ event }) {
    let popoverClickRootClose = (
      <Popover id="popover-trigger-click-root-close" style={{ zIndex: 10000 }}>
        <strong><p>{event.type} - {event.status}</p></strong>
        <strong>{event.title}</strong>
      </Popover>
    );
    return (
      <div>
        <div>
          <OverlayTrigger id="help" trigger="click" rootClose container={this} placement="top" overlay={popoverClickRootClose}>
            <div>{event.type} - {event.status}</div>
          </OverlayTrigger>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="app-main">
        <AppSidebar />
        <div className="app-main__outer">
          <div className="app-main__inner">
            <ReactCSSTransitionGroup
              component="div"
              transitionName="TabsAnimation"
              transitionAppear
              transitionAppearTimeout={0}
              transitionEnter={false}
              transitionLeave={false}
            >
              <div>
                <PageTitle
                  heading="Dashboard"
                  subheading="Gives you insights of your leaves"
                  icon="pe-7s-home icon-gradient bg-mean-fruit"
                />
                <Row>
                  <Col md="12" lg="12">
                    <Row>
                      <Col>
                        <Calendar
                          popup
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
    </>
  );
};

export default Dashborad;
