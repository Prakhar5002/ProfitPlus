import {View, Text} from 'react-native';
import React from 'react';

const CustomSlider = ({value, style}) => {
  return (
    <View
      style={[
        {borderRadius: 12, flex: 1, height: 7, backgroundColor: '#dbdbdb', marginTop: 3},
        style,
      ]}>
      <View
        style={{
          borderRadius: 12,
          backgroundColor: 'green',
          width: '60%',
          height: 7,
        }}
      />
    </View>
  );
};

export default CustomSlider;
