import {View, Text, Image} from 'react-native';
import React from 'react';
import images from '@assets/images';

const Splash = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        style={{width: 200, height: 200}}
        resizeMode="contain"
        source={images.profitplus}
      />
    </View>
  );
};

export default Splash;
