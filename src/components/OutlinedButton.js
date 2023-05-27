import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const OutlinedButton = ({onPress, style, title}) => {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#3b7deb',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    elevation: 2,
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowColor: 'black',
  },
  btnText: {
    color: '#3b7deb',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OutlinedButton;
