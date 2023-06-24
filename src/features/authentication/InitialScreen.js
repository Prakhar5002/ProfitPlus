import {View, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '@constants';
import {AUTH_STACK, BOTTOM_TAB} from '@navigation/screenNames';
import {userDetails} from '@redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAppVersion,
  getUserDetails,
  checkOrderStatus,
  paymentResponse,
} from '@queries';
import {setStorageObject} from '@utils/handleLocalStorage';
import {JSHash, CONSTANTS} from 'react-native-hash';
import DeviceInfo from 'react-native-device-info';
import ResponseModal from '@components/ResponseModal';
import images from '@assets/images';
import Loader from '@components/Loader';
import moment from 'moment';

const InitialScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  let details;
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
        details = localRes;
        dispatch(userDetails(localRes));
      }
    });
    AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN).then(res => {
      if (res !== null) {
        fetchUserDetails();
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

  const fetchUserDetails = () => {
    setLoading(true);
    if (!details?.mobile) {
      handleInitialData();
    }
    const formData = new FormData();
    const userMobile = details?.mobile;
    formData.append('mobile', userMobile);
    formData.append('country_code', '+91');
    getUserDetails(formData)
      .then(res => {
        if (res && res?.status && res?.wallet_amount) {
          dispatch(
            userDetails({
              ...details,
              walletAmount: res.wallet_amount,
              username: res.name,
              referalCode: res.referral_code,
              cashAmount: res.cash_amount,
              minimumAmount: res.mini_wallet_amount,
            }),
          );
        }
      })
      .catch(err => {
        console.warn(err);
      })
      .finally(() => {
        AsyncStorage.getItem(STORAGE_KEYS.PENDING_TRANSACTION)
          .then(localRes => {
            if (localRes !== null) {
              checkStatus();
            } else {
              setLoading(false);
              navigation.navigate(BOTTOM_TAB);
            }
          })
          .catch(err => console.warn(err))
          .finally(() => {
            if (!details?.mobile) {
              handleInitialData();
            } else {
              setLoading(false);
              navigation.navigate(BOTTOM_TAB);
            }
          });
      });
  };

  const checkStatus = () => {
    AsyncStorage.getItem(STORAGE_KEYS.PENDING_TRANSACTION).then(localRes => {
      if (localRes !== null && localRes?.length > 0) {
        localRes = JSON.parse(localRes);
        for (let i = 0; i < localRes.length; i++) {
          const jsonData = {
            key: '9e384614-47d4-49b8-9664-8e93c55940e9',
            client_txn_id: localRes[i]?.txnId,
            txn_date: localRes[i]?.currentDate,
          };
          checkOrderStatus(jsonData)
            .then(res => {
              if (res && res?.status) {
                fetchPaymentResponse(localRes[i]?.txnId, res, localRes);
              }
            })
            .catch(err => {
              console.warn(err);
            })
            .finally(() => {
              AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTION_DETAILS);
            });
        }
      }
    });
  };

  const fetchPaymentResponse = (txnId, data) => {
    const newData = {
      amount: data.data.amount,
      client_txn_id: data.data.client_txn_id,
      createdAt: data.data.createdAt,
      customer_email: data.data.customer_email,
      customer_mobile: data.data.customer_mobile,
      customer_name: data.data.customer_name,
      customer_vpa: data.data.customer_vpa,
      id: data.data.id,
      p_info: data.data.p_info,
      redirect_url: data.data.redirect_url,
      remark: data.data.remark,
      status: data.data.status,
      txnAt: data.data.txnAt,
      upi_txn_id: data.data.upi_txn_id,
    };
    const formData = new FormData();
    formData.append('mobile', details.mobile);
    formData.append('country_code', '+91');
    formData.append('client_txn_id', txnId);
    formData.append('payment_status', data.status);
    formData.append('payment_data', JSON.stringify(newData));
    const hashKey = '+91' + txnId + details?.mobile;
    JSHash(hashKey, CONSTANTS.HashAlgorithms.sha256)
      .then(hash => {
        formData.append('authchecksum', hash);
      })
      .catch(err => console.warn(err))
      .finally(() => {
        paymentResponse(formData)
          .then(res => {
            AsyncStorage.getItem(STORAGE_KEYS.PENDING_TRANSACTION).then(
              localRes => {
                if (localRes !== null && localRes?.length > 0) {
                  const newStorageArr = [];
                  for (let i = 0; i < localRes?.length; i++) {
                    if (localRes[i]?.txnId !== txnId) {
                      newStorageArr.push(localRes[i]);
                    }
                  }
                  setStorageObject(newStorageArr);
                }
              },
            );
          })
          .catch(err => {
            console.warn('err', err);
          });
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
