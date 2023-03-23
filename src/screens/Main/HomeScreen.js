import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import {routes, goBack} from '../../utils/navigator';

const HomeScreen = ({componentId}) => {
  //   const isAuthenticated = useSelector(state => !!state.auth.token);
  const isAuthenticated = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.auth.isLoading);

  return (
    <View style={styles.homeContainer}>
      <Text>{isLoading}</Text>
      <Text>{isAuthenticated ? 'Da dang nhap' : 'Chua dang nhap'}</Text>
      <Button
        title="goBack"
        onPress={() => {
          //test purpose
          goBack(componentId);
        }}
      />
      <Icon name="music" size={30} color="#900" />
    </View>
  );
};

HomeScreen.screenName = routes.Home;
HomeScreen.options = {
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

export default HomeScreen;
