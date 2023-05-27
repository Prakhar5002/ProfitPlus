import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {setSmallFont} from '@utils/setStyle';
import images from '@assets/images';

const ListView = ({item, style, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.5}
      onPress={() => onPress(item)}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image style={{width: 18, height: 18}} source={item.source} />
        <View style={styles.textView}>
          <Text style={setSmallFont(14)}>{item.title}</Text>
        </View>
        <Image style={{width: 22, height: 22}} source={images.chevron_right} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
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

export default ListView;
