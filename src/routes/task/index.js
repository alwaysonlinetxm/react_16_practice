import Store, { injectAsyncReducer, injectAsyncSaga } from '../../store/Store';
import actions from '../../actions/actions';

export default ({
  getData() {
    return [
      // sync action
      Store.dispatch(actions.setTopbar('task')),
      // async action
      new Promise((resolve) => Store.dispatch(actions.getTask({
        cb: res => resolve(res)
      })))
    ];
  },

  getComponent(nextState, cb) {
    try {
      require.ensure([], require => {
        injectAsyncReducer({
          task: require('../../reducers/TaskReducer').default
        });
        injectAsyncSaga(require('../../sagas/TaskSaga').default);

        cb(null, require('./Task').default);
      }, 'Task');
    } catch (e) {
      console.warn('[Task]路由加载失败');
      console.error(e)
    }
  }
});
