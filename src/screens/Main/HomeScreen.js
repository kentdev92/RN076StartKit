import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {connect} from 'react-redux';

import {actions} from '../../redux/slices/auth.slice';

const HomeScreen = props => {
  return (
    <View style={styles.homeContainer}>
      <Text>{props.auth?.isLoading}</Text>
      <Button
        onPress={() => {
          //test purpose
          actions.loginRequest();
        }}
      />
    </View>
  );
};

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

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, actions)(HomeScreen);
