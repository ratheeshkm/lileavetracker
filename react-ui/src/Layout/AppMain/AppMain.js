import { Route, Redirect, Switch } from "react-router-dom";
import React, { Suspense, lazy, Fragment } from "react";
import { ToastContainer } from "react-toastify";

const Dashborad = lazy(() =>
  import("../../pages/Dashborad/DashboardContainer")
);
const Leaves = lazy(() => import("../../pages/Leaves/Leaves"));
const ApplyLeave = lazy(() => import("../../pages/Leaves/ApplyLeaveContainer"));
const Report = lazy(() => import("../../pages/Report/ReportContainer"));
const Login = lazy(() => import("../../pages/Login/LoginContainer"));

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  const { loggedIn } = rest;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const AppMain = (props) => {
  return (
    <Fragment>
      <Suspense fallback={<div>Loading ....</div>}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/dashboard" {...props}>
            <Dashborad />
          </PrivateRoute>
          <PrivateRoute exact path="/leaves" {...props}>
            <Leaves />
          </PrivateRoute>
          <PrivateRoute exact path="/apply-leave" {...props}>
            <ApplyLeave />
          </PrivateRoute>
          <PrivateRoute exact path="/report" {...props}>
            <Report />
          </PrivateRoute>
          <Route exact path="/" component={Login} />
        </Switch>
      </Suspense>
      <ToastContainer />
    </Fragment>
  );
};

export default AppMain;
