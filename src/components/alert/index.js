import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Style from './style.scss';

export default class Alert extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    button: PropTypes.string,
    close: PropTypes.func.isRequired
  }

  static defaultProps = {
    title: '',
    content: '',
    button: '确定'
  }

  render() {
    const { title, content, button, close } = this.props;

    return (
      <div className={ Style.cover }>
        <div className={ Style.box }>
          <h1 className={ Style.title }>{ title }</h1>
          <p className={ Style.content }>{ content }</p>
          <button className={ Style.button } onClick={ close }>{ button }</button>
        </div>
      </div>
    )
  }
}
