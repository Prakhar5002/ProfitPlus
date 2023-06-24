import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import globalStyles from '@styles/globalStyles';

const NoConnection = ({onPress}) => {
  return (
    <View style={globalStyles.center}>
      <Text
        style={{
          color: '#000',
          textAlign: 'center',
          fontSize: 18,
          fontWeight: '600',
        }}>
        No Internet connection.
      </Text>
      <Text style={{color: '#090909', marginBottom: 20}}>
        Please check your connection and try again
      </Text>
      <TouchableOpacity
        onPress={onPress}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: 'green',
        }}>
        <Text style={{color: 'white'}}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoConnection;
