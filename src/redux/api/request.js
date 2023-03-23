import axios from 'axios';
import Config from 'react-native-config';
import {store} from '../configureStore';
import qs from 'qs';

export default function request(options) {
  return axios(options);
}

function* requestAPI(path, method, params = {}, timeout = 15000) {
  let baseUrl = Config.API_URL;
  let additionalPath = params.id
    ? `${path}/${params.id}${params.suffix ? '/' + params.suffix : ''}`
    : path;
  let token = store.getState().auth.token;
  let accessToken = yield token ? token : null;
  let headers = {
    'Content-Type': params.formEncoded
      ? 'application/x-www-form-urlencoded'
      : params.formData
      ? 'multipart/form-data'
      : 'application/json',
  };
  if (accessToken) {
    headers = {
      ...headers,
      Authorization: `bearer ${accessToken}`,
    };
  }
  let response = null;
  try {
    response = yield axios.request({
      url: additionalPath,
      method: method,
      baseURL: baseUrl,
      headers: headers,
      data: params.body || qs.stringify(params.formEncoded) || params.formData,
      params: params.query,
      timeout: timeout,
    });
    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
    return e;
  }
}

// const safeGet = (p, o) => p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);

// const isSuccess = response => {
//   return (
//     response.status === 200 &&
//     safeGet(['data', 'status'], response) === 'success'
//   );
// };

// const getData = (response, key = 'data') => {
//   return (
//     safeGet(['data', key], response) || safeGet([key], response) || response
//   );
// };

// const getError = response => {
//   return (
//     safeGet(['error', 'response', 'data', 'err'], response) ||
//     safeGet(['response', 'data', 'msg'], response) ||
//     safeGet(['response', 'message'], response) ||
//     safeGet(['data', 'message'], response) ||
//     safeGet(['response', 'data', 'err'], response)
//   );
// };

export {requestAPI};
