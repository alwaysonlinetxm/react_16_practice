import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Style from './style.scss';

export default class TopBar extends Component {
  static propTypes = {
    title: PropTypes.string
  }

  render() {
    return (
      <div className={ Style.box }>
        <h1 className={ Style.topbar }>{ this.props.title }</h1>
      </div>
    );
  }
}
