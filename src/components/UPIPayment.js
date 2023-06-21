import {View, Text, Image, Pressable, StyleSheet, Linking} from 'react-native';
import React from 'react';
import globalStyles from '@styles/globalStyles';
import images from '@assets/images';

const Item = ({title, onPress, source}) => (
  <Pressable style={styles.item} onPress={onPress}>
    <Image style={{width: 25, height: 25}} source={source} />
    <Text style={{color: '#000', fontSize: 16, marginLeft: 20}}>{title}</Text>
  </Pressable>
);

const UPIPayment = ({route}) => {
  const paytm = route?.params?.url?.paytm_link ?? undefined;
  const bhim = route?.params?.url?.bhim_link ?? undefined;
  const gpay = route?.params?.url?.gpay_link ?? undefined;
  const Phonepe = route?.params?.url?.phonepe_link ?? undefined;
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {paytm && (
        <Item
          title="Paytm"
          onPress={() => Linking.openURL(paytm)}
          source={images.upi_bhim}
        />
      )}
      {Phonepe && (
        <Item
          title="Phonepe"
          onPress={() => Linking.openURL(Phonepe)}
          source={images.upi_bhim}
        />
      )}
      {gpay && (
        <Item
          title="GPay"
          onPress={() => Linking.openURL(gpay)}
          source={images.upi_bhim}
        />
      )}
      {bhim && (
        <Item
          title="BHIM"
          onPress={() => Linking.openURL(bhim)}
          source={images.upi_bhim}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default UPIPayment;
