import {View} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import WebView from 'react-native-webview';
import {STORAGE_KEYS} from '@constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setStorageString, setStorageObject} from '@utils/handleLocalStorage';
import {getPaymentStatus, checkOrderStatus} from '@queries';
import {useSelector} from 'react-redux';

const PaymentWebview = ({route, navigation}) => {
  const [delay, setDelay] = useState(5);
  const timer = useRef();
  const userLocalDetails = useSelector(state => state.userDetails.data);
  const {url, uniqueId} = route?.params;

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
    <View style={{flex: 1}}>
      <WebView source={{uri: url}} style={{flex: 1}} />
    </View>
  );
};

export default PaymentWebview;
