import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import {actions} from '../../redux/slices/auth.slice';

const LoadingScreen = () => {
  //   const isAuthenticated = useSelector(state => !!state.auth.token);
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.auth.isLoading);
  const dispatch = useDispatch();
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
          title="Login Request"
          onPress={() => {
            //test purpose
            console.log('test request');
            dispatch(actions.loginRequest());
          }}
        />
      )}
      <Icon name="music" size={30} color="#900" />
    </View>
  );
};

LoadingScreen.options = {
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

export const name = 'LoadingScreen';

export default LoadingScreen;
