import {Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import images from '@assets/images';

const OptionsHeader = ({title, style, onPress, isMore = true}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[{flexDirection: 'row', marginVertical: 10}, style]}>
      <Text style={{fontSize: 18, fontWeight: '600', color: '#000', flex: 1}}>
        {title}
      </Text>
      {isMore && (
        <Image
          style={{width: 22, height: 25, tintColor: '#000'}}
          resizeMode="contain"
          source={images.right_arrow}
        />
      )}
    </TouchableOpacity>
  );
};

export default OptionsHeader;
