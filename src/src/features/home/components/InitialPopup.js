import {View, Text, Image, Pressable, Linking} from 'react-native';
import React from 'react';
import CloseButton from '@components/CloseButton';
import images from '@assets/images';

const InitialPopup = ({onClose}) => {
  return (
    <Pressable
      onPress={onClose}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          paddingVertical: 20,
          paddingHorizontal: 10,
          width: '90%',
        }}>
        <CloseButton onPress={onClose} />
        <View style={{alignItems: 'center'}}>
          <Pressable onPress={() => Linking.openURL('https://t.me/PR0FITPLUS')}>
            <Image
              style={{width: 80, height: 80}}
              source={images.telegram_icon}
            />
            <Text style={{fontSize: 18, color: 'grey'}}>Telegram</Text>
          </Pressable>
          <Text
            style={{
              fontSize: 20,
              color: '#000',
              fontWeight: '600',
              marginTop: 10,
            }}>
            Official telegram channel
          </Text>
          <Text style={{fontSize: 14, color: 'grey', textAlign: 'center'}}>
            Join the official telegram channel{'\n'}to get the latest daily
            rewards
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default InitialPopup;
