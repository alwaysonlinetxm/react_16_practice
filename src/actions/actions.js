import { createActions } from 'redux-actions';

const noop = () => {};
const retFirst = data => data;

export default createActions({
  // request
  [ActionTypes.REQUEST]: retFirst,
  // topbar
  [ActionTypes.SET_TOPBAR]: retFirst,
  // task
  [ActionTypes.GET_TASK]: noop
});
