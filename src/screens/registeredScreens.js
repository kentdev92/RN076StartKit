import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';

import LoadingScreen from './Auth/LoadingScreen';
import LoginScreen from './Auth/LoginScreen';
import HomeScreen from './Main/HomeScreen';

export const registeredScreens = store => {
  Navigation.registerComponent(
    LoadingScreen.screenName,
    () => props =>
      (
        <Provider store={store}>
          <LoadingScreen {...props} />
        </Provider>
      ),
    () => LoadingScreen,
  );
  Navigation.registerComponent(
    LoginScreen.screenName,
    () => props =>
      (
        <Provider store={store}>
          <LoginScreen {...props} />
        </Provider>
      ),
    () => LoginScreen,
  );
  Navigation.registerComponent(
    HomeScreen.screenName,
    () => props =>
      (
        <Provider store={store}>
          <HomeScreen {...props} />
        </Provider>
      ),
    () => HomeScreen,
  );
};
