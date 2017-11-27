import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import ActionTypes from '../constants/ActionTypes';

const initState = Immutable({
  title: ''
});

export default handleActions({
  [ActionTypes.SET_TOPBAR]: (state, action) => state.merge({ title: action.payload })
}, initState);
