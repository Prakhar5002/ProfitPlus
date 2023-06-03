import {View, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '@constants';
import {AUTH_STACK, BOTTOM_TAB} from '@navigation/screenNames';
import {userDetails} from '@redux/actions';
import {useDispatch} from 'react-redux';
import {getAppVersion} from '@queries';
import {setStorageObject} from '@utils/handleLocalStorage';
import DeviceInfo from 'react-native-device-info';
import ResponseModal from '@components/ResponseModal';
import images from '@assets/images';
import Loader from '@components/Loader';
import moment from 'moment';

const InitialScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getAppVersion()
      .then(res => {
        if (res && res?.status) {
          let version = DeviceInfo.getVersion();
          if (parseFloat(version) !== res.data.androidversion) {
            setIsUpdate(true);
          } else {
            handleInitialData();
          }
        }
      })
      .catch(err => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  const handleInitialData = () => {
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
    AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN).then(res => {
      if (res !== null) {
        res = JSON.parse(res);
        const newData = {
          previous: res.next,
          next: moment().format('MMMM Do YYYY, h:mm a'),
        };
        setStorageObject(STORAGE_KEYS.LAST_LOGIN, newData);
      } else {
        const newData = {
          previous: moment().format('MMMM Do YYYY, h:mm a'),
          next: moment().format('MMMM Do YYYY, h:mm a'),
        };
        setStorageObject(STORAGE_KEYS.LAST_LOGIN, newData);
      }
    });
  };

  if (isUpdate) {
    return (
      <ResponseModal
        title="Update available"
        text="A new version is available to download"
        icon={images.update_icon}
        onPress={() => {
          Linking.openURL(`http://profitpluszone.com/download`);
        }}
      />
    );
  }

  if (loading) {
    return <Loader isTransparent={false} />;
  }

  return <View />;
};

export default InitialScreen;
