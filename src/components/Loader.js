import {View, StyleSheet} from 'react-native';
import React from 'react';
import globalStyles from '@styles/globalStyles';
import colors from '@styles/colors';
import Spinner from 'react-native-spinkit';

const Loader = ({isTransparent = true}) => {
  return (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor: isTransparent ? 'rgba(0,0,0,0.5)' : 'white',
        },
      ]}>
      <View style={[globalStyles.center, styles.container]}>
        <Spinner size={50} color="#3b7deb" type="ThreeBounce" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  innerContainer: {
    backgroundColor: colors.WHITE,
    padding: 30,
    elevation: 5,
  },
});

export default Loader;
