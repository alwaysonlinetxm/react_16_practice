import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AStyle from '../alert/style.scss';
import Style from './style.scss';

export default class Confirm extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
    button: PropTypes.string,
    cancel: PropTypes.string,
    callback: PropTypes.func,
    close: PropTypes.func.isRequired
  }

  static defaultProps = {
    title: '提示',
    content: '',
    button: '确定',
    cancel: '取消'
  }

  onClick = () => {
    this.props.close();
    this.props.callback(true)
  }

  onCancel = () => {
    this.props.close();
    this.props.callback(false)
  }

  render() {
    const { title, content, button, cancel } = this.props;

    return (
      <div className={ AStyle.cover }>
        <div className={ AStyle.box }>
          <h1 className={ AStyle.title }>{ title }</h1>
          <p className={ AStyle.content }>{ content }</p>
          <div className={ Style.buttons }>
            <button className={ `${AStyle.button} ${Style.button}` } onClick={ this.onClick }>{ button }</button>
            <button className={ `${AStyle.button} ${Style.cancel}` } onClick={ this.onCancel }>{ cancel }</button>
          </div>
        </div>
      </div>
    )
  }
}
