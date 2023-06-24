import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const FilledButton = ({title, onPress, style, disabled}) => {
  return (
    <TouchableOpacity
      style={[styles.btn, style, disabled && {backgroundColor: 'grey'}]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#3b7deb',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2,
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowColor: 'black',
  },
  btnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FilledButton;
