import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import React from 'react';
import {capitalize} from '@utils';
import images from '@assets/images';
import FilledButton from './FilledButton';
import globalStyles from '@styles/globalStyles';

const InvestPlan = ({item, onPress, isPurchaseVisible = true}) => {
  return (
    <View style={styles.itemContainer}>
      {!isPurchaseVisible && (
        <Text style={{color: '#090909', marginBottom: 10}}>
          Order ID:{' '}
          <Text style={{color: '#000', fontWeight: '700', fontSize: 14}}>
            {item?.orderid}
          </Text>
        </Text>
      )}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={styles.image}
          defaultSource={images.profitplus_icon}
          source={{uri: item.image}}
          resizeMode="contain"
        />
        <Text
          style={{
            flex: 1,
            color: '#000',
            fontSize: 20,
            fontWeight: '600',
            marginLeft: 10,
          }}>
          {capitalize(item?.name)}
        </Text>
        {isPurchaseVisible ? (
          <FilledButton
            style={{width: 80, height: 40}}
            title="Buy"
            onPress={() => onPress(item)}
          />
        ) : (
          <Pressable
            style={styles.cardBtnContainer}
            onPress={() => onPress(item)}>
            <Image
              style={[globalStyles.icon, {tintColor: 'white'}]}
              source={images.right_arrow}
            />
          </Pressable>
        )}
      </View>
      <View
        style={{
          borderWidth: 0.3,
          borderColor: '#dbdbdb',
          marginVertical: 10,
        }}
      />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{color: '#090909', fontSize: 12}}>Purchase amount</Text>
          <Text style={styles.infoText}>₹{item?.amount}</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{color: '#090909', fontSize: 12}}>Daily income</Text>
          <Text style={styles.infoText}>{item?.daily_income}%</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{color: '#090909', fontSize: 12}}>Cycle</Text>
          <Text style={styles.infoText}>{item?.cycle_days} days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: 'white',
    elevation: 2,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowColor: 'black',
  },
  image: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  infoText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  cardBtnContainer: {
    backgroundColor: '#3b7deb',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
    borderRadius: 12,
  },
});

export default InvestPlan;
