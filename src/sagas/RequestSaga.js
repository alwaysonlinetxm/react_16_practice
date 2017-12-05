import { put, call, takeEvery } from 'redux-saga/effects';

export default function* request() {
  yield takeEvery(ActionTypes.REQUEST, function* (requestAction) {
    const { data, success, error, start, callback } = requestAction.payload;
    let ret = null;

    if (start) {
      yield put({
        type: start,
        payload: data
      });
    }

    try {
      ret = yield call(Util.requestApi.bind(Util), data);

      if (success) {
        yield put({
          type: success,
          payload: { ...ret, _data: data }
        });
      }
    } catch (e) {
      if (error) {
        yield put({
          type: error,
          payload: { ...ret }
        });
      }
    }
    typeof callback === 'function' && callback(ret);
  });
}
