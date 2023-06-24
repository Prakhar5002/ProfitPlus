import {View, Text, Pressable, FlatList, StyleSheet, Image} from 'react-native';
import React from 'react';
import {capitalize} from '@utils';
import images from '@assets/images';

const AccountOptionsModal = ({data, onPress, onClose}) => {
  const renderOptions = ({item}) => (
    <Pressable
      style={[
        styles.itemContainer,
        item.selected && {backgroundColor: 'green'},
      ]}
      onPress={() => onPress(item)}>
      <Text
        style={{
          fontSize: 18,
          color: item.selected ? 'white' : '#000',
          flex: 1,
        }}>
        {'₹ ' + item?.amount + ' - ' + capitalize(item?.option_key)}
      </Text>
      {item.selected && (
        <Image style={styles.icon} source={images.check_icon} />
      )}
    </Pressable>
  );

  const separatorComponent = () => (
    <View style={{borderWidth: 0.5, borderColor: '#dbdbdb', width: '100%'}} />
  );

  return (
    <Pressable onPress={onClose} style={styles.container}>
      <View style={styles.innerContainer}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderOptions}
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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
  },
  btn: {
    alignSelf: 'center',
    marginTop: 20,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  itemContainer: {
    padding: 10,
    flexDirection: 'row',
    borderRadius: 8,
  },
});

export default AccountOptionsModal;
