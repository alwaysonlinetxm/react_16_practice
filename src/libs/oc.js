import React from 'react';
import ReactDOM from 'react-dom';

import Toast from '../components/toast';
import Alert from '../components/alert';
import Confirm from '../components/confirm';

let domInstance = null;
let timer = null;

function initInstance(Component, props) {
  domInstance && removeInstance();
  domInstance = document.createElement('div')
  document.body.appendChild(domInstance)
  ReactDOM.render(<Component {...props} close={ removeInstance } />, domInstance)
}

function removeInstance() {
  timer && clearTimeout(timer);
  ReactDOM.unmountComponentAtNode(domInstance)
  document.body.removeChild(domInstance)
  domInstance = null
}

export default {
  toast(text = ''){
    initInstance(Toast, { text });
    timer = setTimeout(() => removeInstance(), 2500);
  },

  alert(opt) {
    initInstance(Alert, { ...opt });
  },

  confirm(opt) {
    initInstance(Confirm, { ...opt });
  }
}
