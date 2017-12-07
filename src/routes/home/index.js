import { injectAsyncReducer, injectAsyncSaga } from '../../store/Store';
import actions, { dispatchAsyncAction } from '../../actions/actions';

export default store => ({
  getData() {
    return [
      // sync action
      store.dispatch(actions.setTopbar('home')),
      // async action
      dispatchAsyncAction(store, actions.getHomeText)
    ];
  },

  getComponent(nextState, cb) {
    try {
      require.ensure([], require => {
        injectAsyncReducer(store, {
          home: require('../../reducers/HomeReducer').default
        });
        injectAsyncSaga(store, require('../../sagas/HomeSaga').default);

        cb(null, require('./Home').default);
      }, 'Home');
    } catch (e) {
      console.warn('[Home]路由加载失败');
      console.error(e)
    }
  }
});
