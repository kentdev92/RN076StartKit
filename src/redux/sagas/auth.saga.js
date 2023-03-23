import {call, put, takeLatest} from 'redux-saga/effects';
import {HttpStatusCode} from 'axios';
import Config from 'react-native-config';

import {actions} from '../slices/auth.slice';
import {requestAPI} from '../api/request';
import loading from '../../nativeModules/loading';

export const authSagas = [takeLatest(actions.loginRequest.type, userLoginSaga)];

function* userLoginSaga(action) {
  let response = action.params;
  loading.showLoading();
  try {
    response = yield call(requestAPI, Config.LOGIN, Config.POST, action.params);
    console.log('userLoginSaga', response);
    loading.hideLoading();
    let success = response.status === HttpStatusCode.Ok;
    if (success) {
      const user = response?.data;
      yield put(actions.loginSuccess({user}));
    } else {
      yield put(actions.loginFailure(response));
    }
  } catch (error) {
    loading.hideLoading();
    console.log('Exception in userLoginSaga', error);
    yield put(actions.loginFailure(error));
  }
}
