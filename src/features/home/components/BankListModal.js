import {View, Text, StyleSheet, Pressable, FlatList, Image} from 'react-native';
import React from 'react';
import images from '@assets/images';

const BankListModal = ({data = [], onPress, onClose}) => {
  const renderBankList = ({item}) => (
    <Pressable
      onPress={() => onPress(item)}
      style={[
        styles.itemContainer,
        item.selected && {
          backgroundColor: 'green',
        },
      ]}>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 18,
            color: item.selected ? 'white' : '#000',
            fontWeight: '600',
          }}>
          {item?.bankname}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: item.selected ? '#dbdbdb' : '#090909',
            marginTop: 5,
          }}>
          {item?.bankaccount}
        </Text>
      </View>
      {item.selected && (
        <Image
          style={{width: 30, height: 30, tintColor: 'white'}}
          source={images.check_icon}
        />
      )}
    </Pressable>
  );

  const separatorComponent = () => (
    <View style={{borderWidth: 0.5, borderColor: '#dbdbdb'}} />
  );

  return (
    <Pressable style={styles.container} onPress={onClose}>
      <View style={styles.innerContainer}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderBankList}
          ItemSeparatorComponent={separatorComponent}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  innerContainer: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  itemContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default BankListModal;
