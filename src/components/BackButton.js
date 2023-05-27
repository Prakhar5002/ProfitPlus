import {View, Text, Pressable, Image} from 'react-native';
import React from 'react';
import images from '@assets/images';

const BackButton = ({style, iconStyle, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          width: 30,
          height: 50,
          justifyContent: 'center',
        },
        style,
      ]}>
      <Image
        style={[{width: 18, height: 18, tintColor: 'white'}, iconStyle]}
        source={images.back_icon}
      />
    </Pressable>
  );
};

export default BackButton;
