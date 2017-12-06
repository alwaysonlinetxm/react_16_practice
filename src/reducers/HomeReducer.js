import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import ActionTypes from '../constants/ActionTypes';

const initState = Immutable({
  text: ''
});

export default handleActions({
  [ActionTypes.GET_HOME_TEXT_SUCC]: (state, action) => state.merge({ text: action.payload.text })
}, initState);
