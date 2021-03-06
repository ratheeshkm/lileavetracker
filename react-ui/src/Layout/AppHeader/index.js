import React from 'react';
import cx from 'classnames';

import { connect } from 'react-redux';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import HeaderLogo from '../AppLogo';

import UserBox from './Components/UserBoxContainer';

class Header extends React.Component {
  render() {
    const {
      headerBackgroundColor,
      enableMobileMenuSmall,
      enableHeaderShadow
    } = this.props;
    return (
      <>
        <ReactCSSTransitionGroup
          component="div"
          className={cx('app-header', headerBackgroundColor, {
            'header-shadow': enableHeaderShadow
          })}
          transitionName="HeaderAnimation"
          transitionAppear
          transitionAppearTimeout={1500}
          transitionEnter={false}
          transitionLeave={false}
        >
          <HeaderLogo />

          <div
            className={cx('app-header__content', {
              'header-mobile-open': enableMobileMenuSmall
            })}
          >
            <div className="app-header-left" />
            <div className="app-header-right">
              <UserBox />
            </div>
          </div>
        </ReactCSSTransitionGroup>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
  closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
  headerBackgroundColor: state.ThemeOptions.headerBackgroundColor,
  enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
