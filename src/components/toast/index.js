import React from 'react';
import PropTypes from 'prop-types';

import Style from './style.scss';

export default function Toast(props) {
  return <div className={ Style.toast } style={{zIndex:999}}>{ props.text }</div>;
}

Toast.propTypes = {
  text: PropTypes.string.isRequired
};
