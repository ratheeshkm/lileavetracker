import React, { Fragment } from 'react';

import cx from 'classnames';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSearch: false
    };
  }

  render() {
    return (
      <>
        <div
          className={cx('search-wrapper', {
            active: this.state.activeSearch
          })}
        >
          <div className="input-holder" />
          <button
            onClick={() =>
              this.setState({ activeSearch: !this.state.activeSearch })
            }
            className="close"
          />
        </div>
      </>
    );
  }
}

export default SearchBox;
