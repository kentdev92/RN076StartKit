/**
 * @format
 */

import {Navigation} from 'react-native-navigation';

import {setRoot, currentScreen, routes} from './src/utils/navigator';
import {registeredScreens} from './src/screens/registeredScreens';
import {store} from './src/redux/configureStore';
// import './src/themes';
// import './src/configs';

registeredScreens(store);
Navigation.events().registerAppLaunchedListener(() => {
  setRoot(routes.Loading);
});
Navigation.events().registerComponentDidAppearListener(
  ({componentId, componentName, passProps}) => {
    if (componentName && componentId) {
      currentScreen.set('component', {
        componentId,
        componentName,
        passProps,
      });
    }
  },
);
