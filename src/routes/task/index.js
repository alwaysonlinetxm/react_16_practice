import { injectAsyncReducer, injectAsyncSaga } from '../../store/Store';
import actions, { dispatchAsyncAction } from '../../actions/actions';


// exported as a function for accepting a initial store when server rendering
export default store => ({
  path: '/task',
  getData() {
    return [
      // sync action
      store.dispatch(actions.setTopbar('task')),
      // async action
      dispatchAsyncAction(store, actions.getTask)
    ];
  },

  getComponent(nextState, cb) {
    try {
      require.ensure([], require => {
        injectAsyncReducer(store, {
          task: require('../../reducers/TaskReducer').default
        });
        injectAsyncSaga(store, require('../../sagas/TaskSaga').default);

        cb(null, require('./Task').default);
      }, 'Task');
    } catch (e) {
      console.warn('[Task]路由加载失败');
      console.error(e)
    }
  }
});
