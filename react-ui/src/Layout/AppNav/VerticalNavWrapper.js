import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import MetisMenu from "react-metismenu";
import { ComponentsNav, ComponentsNavApprover } from "./NavItems";

class Nav extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    console.log(ComponentsNav)
  }
  
  render() {
    return (
      <Fragment>
        <h5 className="app-sidebar__heading">MENU</h5>
        {this.props.user.type === 'Approver' && <MetisMenu
          content={ComponentsNavApprover}
          activeLinkFromLocation
          className="vertical-nav-menu"
          iconNamePrefix=""
          classNameStateIcon="pe-7s-angle-down"
        />}

        {this.props.user.type !== 'Approver' && <MetisMenu
          content={ComponentsNav}
          activeLinkFromLocation
          className="vertical-nav-menu"
          iconNamePrefix=""
          classNameStateIcon="pe-7s-angle-down"
        />}
        
      </Fragment>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(Nav);
