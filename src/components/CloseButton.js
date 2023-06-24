import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import images from '@assets/images';

const CloseButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.btnContainer}>
        <Text style={styles.btnText}>x</Text>
      </View>
    </TouchableOpacity>
  );
};

const btnSize = 30;
const styles = StyleSheet.create({
  btnContainer: {
    width: btnSize,
    height: btnSize,
    borderRadius: btnSize / 2,
    borderWidth: 1,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  btnText: {
    fontSize: 24,
    color: 'red',
    top: -5,
  },
});
export default CloseButton;
