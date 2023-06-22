import {View, Text, Image, Pressable, StyleSheet, Linking} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import globalStyles from '@styles/globalStyles';
import {useSelector} from 'react-redux';
import images from '@assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '@constants';
import {setStorageString, setStorageObject} from '@utils/handleLocalStorage';
import {checkOrderStatus, getPaymentStatus} from '@queries';

const Item = ({title, onPress, source}) => (
  <Pressable style={styles.item} onPress={onPress}>
    <Image style={{width: 25, height: 25}} source={source} />
    <Text style={{color: '#000', fontSize: 16, marginLeft: 20}}>{title}</Text>
  </Pressable>
);

const UPIPayment = ({route, navigation}) => {
  const paytm = route?.params?.url?.paytm_link ?? undefined;
  const bhim = route?.params?.url?.bhim_link ?? undefined;
  const gpay = route?.params?.url?.gpay_link ?? undefined;
  const Phonepe = route?.params?.url?.phonepe_link ?? undefined;
  const [delay, setDelay] = useState(5);
  const timer = useRef();
  const userLocalDetails = useSelector(state => state.userDetails.data);
  const {uniqueId} = route?.params;

  useEffect(() => {
    timer.current = setInterval(() => {
      setDelay(delay - 1);
    }, 1000);
    if (delay === 0 || delay < 0) {
      fetchPaymentStatus();
      setDelay(5);
    }

    return () => clearInterval(timer.current);
  }, [delay]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.TRANSACTION_TIME)
      .then(res => {
        if (res === null) {
          const currentTime = new Date();
          setStorageString(STORAGE_KEYS.TRANSACTION_TIME, String(currentTime));
        } else {
          const currentTime = String(new Date());
          const diff = Date.parse(currentTime) - Date.parse(res);
          if (diff >= 180000) {
            AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTION_TIME);
            navigation.goBack();
          }
        }
      })
      .catch(err => console.warn(err));
  }, [delay]);

  const checkStatus = () => {
    AsyncStorage.getItem(STORAGE_KEYS.TRANSACTION_DETAILS).then(localRes => {
      if (localRes !== null) {
        localRes = JSON.parse(localRes);
        const pendingTransaction = [];
        pendingTransaction.push(localRes);
        setStorageObject(STORAGE_KEYS.PENDING_TRANSACTION, pendingTransaction);
        const jsonData = {
          key: '9e384614-47d4-49b8-9664-8e93c55940e9',
          client_txn_id: uniqueId,
          txn_date: localRes?.currentDate,
        };
        checkOrderStatus(jsonData)
          .then(res => {
            if (res) {
              if (
                res?.data?.status === 'failure' ||
                res?.data?.status === 'success'
              ) {
                AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTION_TIME);
                navigation.goBack();
              }
            }
          })
          .catch(err => {
            console.warn(err);
          });
      }
    });
  };

  const fetchPaymentStatus = () => {
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    formData.append('user_txn_id', uniqueId);
    getPaymentStatus(formData)
      .then(res => {
        if (res && res?.status) {
          navigation.goBack();
        } else {
          checkStatus();
        }
      })
      .catch(err => console.warn(err));
  };
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
