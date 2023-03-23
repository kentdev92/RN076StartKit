import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {persistStore, persistReducer} from 'redux-persist';
import logger from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';

import reducers from './slices';
import promise from '../utils/promise';
import RootSaga from './sagas/rootSaga';

const devMode = process.env.NODE_ENV === 'development';
const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const middleWares = [sagaMiddleware, promise];
const persistedReducer = persistReducer(persistConfig, reducers);
if (devMode) {
  middleWares.push(logger);
}

const store = configureStore({
  reducer: persistedReducer,
  devTools: devMode,
  middleware: middleWares,
});

const persister = persistStore(store);

sagaMiddleware.run(RootSaga);

export {store, persister};
