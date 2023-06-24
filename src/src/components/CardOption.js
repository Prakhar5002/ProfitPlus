import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {setSmallFont} from '@utils/setStyle';
import images from '@assets/images';

const CardOption = ({title, source, style}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} activeOpacity={0.5}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{width: 18, height: 18}} source={source} />
        <View style={styles.textView}>
          <Text style={setSmallFont(14)}>{title}</Text>
        </View>
        <Image style={{width: 22, height: 22}} source={images.chevron_right} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
    alignSelf: 'center',
    padding: 20,
  },
  textView: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  description: {
    color: 'grey',
    marginTop: 5,
    fontSize: 12,
  },
});

export default CardOption;
