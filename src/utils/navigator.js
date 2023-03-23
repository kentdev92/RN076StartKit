// import {Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as colors from '../themes/colors';

const currentScreen = new Map();

const setRoot = (screenName, passProps = {}) => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: screenName,
              options: {
                animations: {
                  setRoot: {
                    waitForRender: true,
                  },
                },
              },
              passProps,
            },
          },
        ],
        options: {
          animations: {
            setRoot: {
              waitForRender: true,
            },
          },
        },
      },
    },
  });
};
const navigateToScreen = (
  componentId,
  screenName,
  passProps = {},
  options = {},
) => {
  Navigation.push(componentId, {
    component: {
      name: screenName,
      passProps,
      // options,
      options: Object.assign(options, {
        animations: {
          push: {
            waitForRender: true,
          },
        },
      }),
    },
  });
};

const goBack = (componentId, passProps = {}) => {
  Navigation.pop(componentId, passProps);
};
const gotBackToRoot = componentId => {
  Navigation.popToRoot(componentId);
};
const getListOfTabItems = async (
  activityIcon,
  homeIcon,
  sendIcon,
  profileIcon,
  chatIcon,
) => {
  return [
    {
      index: 0,
      text: 'Home',
      key: 'HomeView',
      icon: homeIcon,
    },
    {
      index: 4,
      text: 'Feed',
      key: 'NotificationView',
      icon: activityIcon,
    },
    {
      index: 1,
      text: 'Post',
      key: 'PostView',
      icon: homeIcon,
    },
    {
      index: 2,
      text: 'Wallet',
      key: 'WalletView',
      icon: activityIcon,
    },
    {
      index: 3,
      text: 'Store',
      key: 'ListStoreView',
      icon: activityIcon,
    },
  ];
};

const getListOfTab = async (passProps = {}) => {
  let listOfTabs = [];
  await Promise.all([
    MaterialCommunityIcons.getImageSource('file-document', 25),
    MaterialCommunityIcons.getImageSource('home-variant', 25),
    MaterialCommunityIcons.getImageSource('file-send', 25),
    MaterialCommunityIcons.getImageSource('account-circle', 25),
    MaterialIcons.getImageSource('chat', 35),
  ]).then(async ([activityIcon, homeIcon, sendIcon, profileIcon, chatIcon]) => {
    let items = await getListOfTabItems(
      activityIcon,
      homeIcon,
      sendIcon,
      profileIcon,
      chatIcon,
    );
    items.forEach(item => {
      const {key, text, selectedSource, icon} = item;
      listOfTabs.push({
        stack: {
          children: [
            {
              component: {
                id: key,
                name: key,
                passProps: {...passProps[key]},
              },
            },
          ],
          options: {
            bottomTab: {
              // text,
              icon: icon,
              selectedIconColor: colors.COLOR_PRIMARY,
              testID: key,
              selectedFontSize: 12,
              fontSize: 10,
              textColor: colors.COLOR_GRAY,
              selectedTextColor: colors.COLOR_PRIMARY,
              ...Platform.select({
                ios: {
                  iconInsets: {top: 0, left: 0, bottom: 0, right: 0},
                  selectedIcon: selectedSource,
                  disableIconTint: true,
                  disableSelectedIconTint: true,
                },
              }),
            },
          },
        },
      });
    });
  });

  return listOfTabs;
};

const setRootUser = (listOfTabs, currentTabIndex = 0) => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        children: listOfTabs,
        options: {
          bottomTabs: {
            backgroundColor: 'white',
            ...Platform.select({
              android: {
                titleDisplayMode: 'alwaysHide',
              },
            }),
            currentTabIndex,
          },
        },
      },
    },
  });
};

const setTabIndex = (index, componentId = 'HomeView') => {
  Navigation.mergeOptions(componentId, {
    bottomTabs: {
      currentTabIndex: index,
    },
  });
};

const showModal = (screenName, passProps = {}) => {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: screenName,
            passProps,
          },
        },
      ],
    },
  });
};

const mergeOptions = (componentId, options) => {
  setTimeout(() => {
    Navigation.mergeOptions(componentId, options);
  }, 100);
};

export {
  mergeOptions,
  currentScreen,
  setRoot,
  navigateToScreen,
  goBack,
  gotBackToRoot,
  getListOfTab,
  getListOfTabItems,
  setRootUser,
  setTabIndex,
  showModal,
};
