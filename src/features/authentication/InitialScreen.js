import {View} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '@constants';
import {AUTH_STACK, BOTTOM_TAB} from '@navigation/screenNames';
import {userDetails} from '@redux/actions';
import {useDispatch} from 'react-redux';

const InitialScreen = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const keys = [
      STORAGE_KEYS.TRANSACTION_TIME,
      STORAGE_KEYS.INITIAL_MESSAGE,
      STORAGE_KEYS.TRANSACTION_ID,
    ];
    AsyncStorage.multiRemove(keys);
    AsyncStorage.getItem(STORAGE_KEYS.USER_DETAILS).then(localRes => {
      if (localRes !== null) {
        localRes = JSON.parse(localRes);
        dispatch(userDetails(localRes));
      }
    });
    AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN).then(res => {
      if (res !== null) {
        navigation.navigate(BOTTOM_TAB);
      } else {
        navigation.navigate(AUTH_STACK);
      }
    });
  }, []);
  return <View />;
};

export default InitialScreen;
