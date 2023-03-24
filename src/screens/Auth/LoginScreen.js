import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';

import {actions} from '../../redux/slices/auth.slice';
import {navigateToScreen, setRoot, routes} from '../../utils/navigator';

const LoginScreen = ({componentId}) => {
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.auth.isLoading);
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();

  useEffect(() => {
    if (!isAuthenticated) {
      setRoot(routes.Loading);
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.homeContainer}>
      <Text>{isLoading}</Text>
      <Text>{isAuthenticated ? 'Da dang nhap' : 'Chua dang nhap'}</Text>
      <Button
        title={t('GoHome')}
        onPress={() => {
          //test purpose
          console.log('test logout');
          navigateToScreen(componentId, 'HomeScreen');
        }}
      />
      <Button
        title="Logout Request"
        onPress={() => {
          //test purpose
          console.log('test logout');
          dispatch(actions.logOut());
        }}
      />
      <Icon name="music" size={30} color="#900" />
    </View>
  );
};

LoginScreen.screenName = routes.Login;
LoginScreen.options = {
  topBar: {
    title: {
      text: 'Loading',
      color: 'white',
      textAlign: 'left',
    },
    background: {
      color: 'purple',
    },
  },
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
  },
});

export default LoginScreen;
