import { createActions } from 'redux-actions';

// const noop = () => {};
const retFirst = data => data;
const dispatchAsyncAction = (store, action, payload = {}) => {
  return new Promise((resolve) => store.dispatch(action({
    ...payload,
    cb: res => resolve(res)
  })));
};

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

export { dispatchAsyncAction };
