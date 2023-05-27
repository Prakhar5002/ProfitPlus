import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import FilledButton from '@components/FilledButton';
import images from '@assets/images';

const ListView = ({item}) => {
  const textData = [
    {
      title: 'Total amount',
      value: '₹' + item?.amount,
    },
    {
      title: 'Daily income',
      value: '₹' + item?.daily_income,
    },
    {
      title: 'Cycle days',
      value: item?.cycle_days,
    },
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        imageStyle={styles.image}
        source={images.corousel3}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>
            {item?.title}
          </Text>
        </View>
      </ImageBackground>
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          {textData.map(item => (
            <View key={item.id} style={{flexDirection: 'row', marginTop: 5}}>
              <Text style={{fontSize: 14, color: 'grey'}}>
                {item.title}
                {': '}
              </Text>
              <Text style={{fontSize: 16, fontWeight: '600', color: '#000'}}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
        <FilledButton style={{width: 80, height: 40}} title="Buy" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
    marginBottom: 10,
    paddingBottom: 20,
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowColor: 'black',
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
});

export default ListView;
