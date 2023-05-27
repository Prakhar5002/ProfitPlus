/* eslint-disable react-native/no-inline-styles */
import {Text} from 'react-native';
import React from 'react';

const Link = ({style, children, onPress, underline = true}) => {
  return (
    <Text
      accessibilityRole="link"
      onPress={onPress}
      style={[
        style,
        underline && {textDecorationLine: 'underline'},
        {fontSize: 14, color: '#3b7deb', fontWeight: '500'},
      ]}>
      {children}
    </Text>
  );
};

export default Link;
