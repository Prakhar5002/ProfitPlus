import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import globalStyles from '@styles/globalStyles';

const News = ({text, source, date, left = false}) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.5}>
      <Image style={styles.image} source={{uri: source}} resizeMode="cover" />
      <View style={globalStyles.container}>
        <Text style={[styles.text]}>{text}</Text>
        <Text style={[styles.date]}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 12,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
    marginLeft: 10,
  },
  date: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 10,
  },
});

export default News;
