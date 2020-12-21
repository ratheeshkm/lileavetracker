import React, { Fragment, useState} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';
import { Row, Col, Card } from 'reactstrap';
import PageTitle from '../../Layout/AppMain/PageTitle';
import { v4 as uuidv4 } from 'uuid';

const Dashborad = (props) => {
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
                                    <Col md="4">
                                        Dashboard
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