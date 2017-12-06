import { createActions } from 'redux-actions';

// const noop = () => {};
const retFirst = data => data;
const asyncActionHandler = (action, store) => new Promise((resolve) => store.dispatch(action({
  cb: res => resolve(res)
})));

export default createActions({
  // request
  [ActionTypes.REQUEST]: retFirst,
  // topbar
  [ActionTypes.SET_TOPBAR]: retFirst,
  // home
  [ActionTypes.GET_HOME_TEXT]: retFirst,
  // task
  [ActionTypes.GET_TASK]: retFirst
});

export { asyncActionHandler };
