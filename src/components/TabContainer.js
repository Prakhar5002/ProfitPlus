import {View, Image, Pressable, Linking} from 'react-native';
import React from 'react';
import images from '@assets/images';
import {CONTACT_NUMBER} from '@constants';

const TabContainer = ({children}) => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          backgroundColor: '#f2f5fe',
          paddingBottom: 7,
        }}>
        {children}
      </View>
      <Pressable
        onPress={() =>
          Linking.openURL(`whatsapp://send?text=""&phone=${CONTACT_NUMBER}`)
        }
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 4,
        }}>
        <Image
          source={images.whatsapp2_icon}
          style={{width: 55, height: 55, elevation: 4}}
        />
      </Pressable>
    </View>
  );
};

export default TabContainer;
