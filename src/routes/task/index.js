import { injectAsyncReducer, injectAsyncSaga } from '../../store/Store';

export default ({
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
