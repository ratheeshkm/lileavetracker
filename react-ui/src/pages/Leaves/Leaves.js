import React from 'react';
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';
import LeaveListContainer from './LeaveListContainer';

const Categories = (props) => {
  return (
    <>
      <AppHeader />
      <div className="app-main">
        <AppSidebar />
        <div className="app-main__outer">
          <div className="app-main__inner">
            <LeaveListContainer />
          </div>
          <AppFooter />
        </div>
      </div>
    </>
  );
};

export default Categories;
