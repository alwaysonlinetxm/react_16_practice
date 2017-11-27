import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import ActionTypes from '../constants/ActionTypes';

const initState = Immutable({
  task: []
});

export default handleActions({
  [ActionTypes.GET_TASK_SUCC]: (state, action) => state.merge({ task: action.payload.task })
}, initState);
