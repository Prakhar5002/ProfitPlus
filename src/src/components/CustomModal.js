import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {capitalize} from '@utils';

const CustomModal = ({title = undefined, message, onPress}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.errorText}>{capitalize(String(message))}</Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.btn}
          onPress={onPress}
          activeOpacity={0.5}>
          <Text style={styles.btnText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  innerContainer: {
    width: '80%',
    borderRadius: 12,
    backgroundColor: 'white',
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  textContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 18,
    marginTop: 5,
  },
  separator: {
    height: 0.8,
    backgroundColor: '#dbdbdb',
    width: '100%',
    marginTop: 20,
  },
  btn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 15,
  },
  btnText: {
    fontSize: 16,
    color: 'rgb(47,125,245)',
  },
});

export default CustomModal;
