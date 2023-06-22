import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import globalStyles from '@styles/globalStyles';
import {verticalMargin} from '@utils/setStyle';
import FilledButton from '@components/FilledButton';
import BackButton from '@components/BackButton';
import recharge from '@assets/data/recharge';
import SelectDropdown from 'react-native-select-dropdown';
import {
  getPaymentStatus,
  createOrder,
  checkOrderStatus,
  paymentResponse,
} from '@queries';
import {useSelector} from 'react-redux';
import {setStorageObject} from '@utils/handleLocalStorage';
import Loader from '@components/Loader';
import CustomSnackbar from '@components/CustomSnackbar';
import BorderInput from '@components/BorderInput';
import {PAYMENT_WEBVIEW, UPI_PAYMENT} from '@navigation/screenNames';
import ResponseModal from '@components/ResponseModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '@constants';
import moment from 'moment';
import {JSHash, CONSTANTS} from 'react-native-hash';

const Recharge = ({navigation}) => {
  const [rechargeAmountData, setRechargeAmountData] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [selectedOption, setSelectedOption] = useState('QR Code');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({
    visible: false,
    type: 0,
    text: '',
  });
  const paymentMethod = ['UPI', 'QR Code'];

  const userLocalDetails = useSelector(state => state.userDetails?.data);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem(STORAGE_KEYS.TRANSACTION_DETAILS)
        .then(res => {
          if (res !== null) {
            res = JSON.parse(res);
            fetchPaymentStatus(res.txnId);
          }
        })
        .catch(err => console.warn(err))
        .finally(() => {
          AsyncStorage.getItem(STORAGE_KEYS.PENDING_TRANSACTION)
            .then(localRes => {
              if (localRes !== null) {
                checkStatus();
              }
            })
            .catch(err => console.warn(err));
        });
    }, []),
  );

  const fetchPaymentStatus = val => {
    const formData = new FormData();
    formData.append('mobile', userLocalDetails.mobile);
    formData.append('country_code', '+91');
    formData.append('user_txn_id', val);
    getPaymentStatus(formData)
      .then(res => {
        if (res && res?.data) {
          if (res.data?.status === 'success') {
            setResponse({
              visible: true,
              type: 1,
              text: 'Recharge done successfully',
            });
          } else {
            setResponse({
              visible: true,
              type: 0,
              text:
                res.data.remark === '' ? 'Recharge failed' : res.data.remark,
            });
          }
          AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTION_DETAILS);
        } else {
          checkStatus();
        }
      })
      .catch(err => console.warn(err));
  };

  const fetchPaymentResponse = (txnId, data, localRes) => {
    const formData = new FormData();
    formData.append('mobile', userLocalDetails.mobile);
    formData.append('country_code', '+91');
    formData.append('client_txn_id', txnId);
    formData.append('status_data', JSON.stringify(data));
    const hashKey = '+91' + txnId + userLocalDetails?.mobile;
    JSHash(hashKey, CONSTANTS.HashAlgorithms.sha256)
      .then(hash => {
        formData.append('authchecksum', hash);
      })
      .catch(err => console.warn(err))
      .finally(() => {
        paymentResponse(formData)
          .then(res => {
            if (localRes?.length > 0) {
              const match = localRes.filter(item => item.txnId !== txnId);
              setStorageObject(STORAGE_KEYS.PENDING_TRANSACTION, match);
            }
          })
          .catch(err => {
            console.warn(err);
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
                if (res.data.status === 'success') {
                  setResponse({
                    visible: true,
                    type: 1,
                    text: 'Recharge done successfully',
                  });
                } else if (res.data.status === 'scanning') {
                  setResponse({
                    visible: true,
                    type: 0,
                    text: 'Payment could not be completed',
                  });
                } else if (res.data.status === 'failure') {
                  setResponse({
                    visible: true,
                    type: 0,
                    text: 'Recharge failed',
                  });
                }
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

  const hitCreateOrder = () => {
    const uniqueId = userLocalDetails?.mobile + String(moment().unix());
    const jsonData = {
      key: '9e384614-47d4-49b8-9664-8e93c55940e9',
      client_txn_id: uniqueId,
      // amount: String(selectedAmount),
      amount: '1',
      p_info: 'Wallet',
      customer_name: userLocalDetails.username,
      customer_email: 'info@profitplus.com',
      customer_mobile: userLocalDetails?.mobile,
      redirect_url: 'http://profitpluszone.com/profit-response',
      udf1: 'user defined field 1 (max 25 char)',
      udf2: 'user defined field 2 (max 25 char)',
      udf3: 'user defined field 3 (max 25 char)',
    };
    createOrder(jsonData)
      .then(res => {
        console.log('Create order response::>>', res);
        if (res && res?.status && res?.data) {
          setStorageObject(STORAGE_KEYS.TRANSACTION_DETAILS, {
            txnId: uniqueId,
            currentDate: moment().format('DD-MM-YYYY'),
          });
          console.log(selectedOption);
          if (selectedOption === 'UPI') {
            navigation.navigate(UPI_PAYMENT, {
              url: res?.data?.upi_intent,
              uniqueId,
            });
          } else {
            navigation.navigate(PAYMENT_WEBVIEW, {
              url: res?.data?.payment_url,
              uniqueId,
            });
          }
        } else {
          CustomSnackbar(res?.msg);
        }
      })
      .catch(err => console.warn(err))
      .finally(() => setIsLoading(false));
  };

  const onRecharge = () => {
    Keyboard.dismiss();
    if (selectedAmount) {
      setIsLoading(true);
      hitCreateOrder();
    }
  };

  useEffect(() => {
    let rechargeArr = [];
    rechargeArr = recharge.map((item, index) => {
      if (index === 0) {
        setSelectedAmount(item.amount);
        return {...item, selected: true};
      }
      return {...item, selected: false};
    });
    setRechargeAmountData(rechargeArr);
  }, []);

  const onSelectAmount = rechargeItem => {
    setSelectedAmount(rechargeItem.amount);
    let rechargeArr = [];
    rechargeArr = recharge.map(item => {
      if (rechargeItem.id === item.id) {
        return {...item, selected: true};
      }
      return {...item, selected: false};
    });
    setRechargeAmountData(rechargeArr);
  };

  const handleAmountChange = val => {
    setSelectedAmount(val);
    let amountArr = [];
    amountArr = rechargeAmountData.map(item => {
      if (item.amount === parseInt(val, 10)) {
        return {...item, selected: true};
      }
      return {...item, selected: false};
    });
    setRechargeAmountData(amountArr);
  };

  const handleCloseResponse = () => {
    setResponse({
      visible: false,
      type: 0,
      text: '',
    });
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerText}>Recharge</Text>
        </View>
      </View>
      <View style={styles.headerCard}>
        <BorderInput
          placeholder="Amount"
          value={String(selectedAmount)}
          onChangeText={val => handleAmountChange(val)}
          keyboardType="number-pad"
        />
        <Text
          style={[
            {color: selectedAmount < 300 ? 'red' : 'white', fontSize: 12},
            verticalMargin(5),
          ]}>
          Minimum amount should be 300
        </Text>
        <View style={styles.rechargeContainer}>
          {rechargeAmountData.map((item, index) => (
            <TouchableOpacity
              key={String(index)}
              style={
                item.selected ? styles.rechargeBtnSelected : styles.rechargeBtn
              }
              onPress={() => onSelectAmount(item)}>
              <Text
                style={[
                  styles.text,
                  {
                    color: item.selected ? 'white' : '#000',
                  },
                ]}>
                {'₹' + item.amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.text2}>Payment method</Text>
        <SelectDropdown
          buttonStyle={styles.dropdownButtonStyle}
          data={paymentMethod}
          defaultValue="UPI"
          onSelect={selectedItem => setSelectedOption(selectedItem)}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />
        <FilledButton
          disabled={selectedAmount < 300}
          style={styles.btn}
          title="RECHARGE CONFIRM"
          onPress={onRecharge}
        />
      </View>
      {isLoading && <Loader />}
      {response.visible && (
        <ResponseModal
          type={response.type}
          text={response.text}
          onPress={handleCloseResponse}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#3b7deb',
    height: 150,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  headerCard: {
    width: '90%',
    top: -30,
    backgroundColor: 'white',
    paddingVertical: 20,
    alignSelf: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    elevation: 2,
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowColor: 'black',
  },
  rechargeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginRight: 8,
    marginTop: 20,
  },
  rechargeBtnSelected: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 20,
    backgroundColor: 'green',
    borderColor: 'green',
  },
  rechargeContainer: {
    flexWrap: 'wrap',
    flexGrow: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  dropdownButtonStyle: {
    backgroundColor: '#f2f5fe',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    width: 150,
  },
  text: {
    color: '#000',
  },
  text2: {
    marginVertical: 10,
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default Recharge;
