import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import images from '@assets/images';
import FilledButton from './FilledButton';

const ResponseModal = ({
  text = '',
  type,
  onPress,
  title = undefined,
  icon = undefined,
}) => {
  let appicon = null;

  switch (type) {
    case 0:
      title = 'Something went wrong';
      appicon = images.fail_icon;
      break;
    case 1:
      title = 'Success';
      appicon = images.success_icon;
      break;
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {icon ? (
          <Image style={styles.image} source={icon} />
        ) : (
          <Image style={styles.image} source={appicon} />
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.divider} />
        <FilledButton style={styles.btn} title="Ok" onPress={onPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  text: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  divider: {
    height: 0.8,
    backgroundColor: '#dbdbdb',
    marginVertical: 20,
  },
  btn: {
    alignSelf: 'center',
    width: 100,
    height: 50,
  },
});

export default ResponseModal;
