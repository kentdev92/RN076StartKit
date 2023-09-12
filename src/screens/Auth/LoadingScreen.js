import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, Pressable} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import codePush from 'react-native-code-push';
import {useTranslation} from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import {actions} from '../../redux/slices/auth.slice';
import {setRoot, routes} from '../../utils/navigator';

const codePushOptions = {
  updateDialog: true,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
};
const LoadingScreen = ({componentId}) => {
  //   const isAuthenticated = useSelector(state => !!state.auth.token);
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.auth.isLoading);
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();

  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(offset.value * 255),
        },
      ],
    };
  });

  const [currentLanguage, setLanguage] = useState(i18n.language);

  useEffect(() => {
    if (isAuthenticated) {
      setRoot(routes.Login);
    }
  }, [isAuthenticated]);

  const changeLanguage = value => {
    i18n
      .changeLanguage(value)
      .then(() => setLanguage(value))
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.homeContainer}>
      <Text>{isLoading}</Text>
      <Text>{isAuthenticated ? 'Da dang nhap' : 'Chua dang nhap'}</Text>
      {isAuthenticated ? (
        <Button
          title="Logout Request"
          onPress={() => {
            //test purpose
            console.log('test logout');
            dispatch(actions.logOut());
          }}
        />
      ) : (
        <Button
          title={t('Login')}
          onPress={() => {
            //test purpose
            console.log('test request');
            dispatch(actions.loginRequest());
          }}
        />
      )}
      <Pressable
        onPress={() => changeLanguage('en')}
        style={{
          backgroundColor: currentLanguage === 'en' ? '#33A850' : '#d3d3d3',
          padding: 20,
        }}>
        <Text>Select English</Text>
      </Pressable>
      <Pressable
        onPress={() => changeLanguage('vi')}
        style={{
          backgroundColor: currentLanguage === 'vi' ? '#33A850' : '#d3d3d3',
          padding: 20,
        }}>
        <Text>Tiếng Việt</Text>
      </Pressable>
      <Icon name="music" size={30} color="#900" />

      <Animated.View style={[styles.box, animatedStyles]} />
      <Button onPress={() => (offset.value = Math.random())} title="Move" />
    </View>
  );
};

LoadingScreen.screenName = routes.Loading;
LoadingScreen.options = {
  topBar: {
    title: {
      text: 'Loading',
      color: 'white',
      textAlign: 'left',
    },
    background: {
      color: 'blue',
    },
  },
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  box: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    borderRadius: 5,
  },
});

const App = codePush(codePushOptions)(LoadingScreen);
export default App;
