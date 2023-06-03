import {View, Text, StyleSheet, BackHandler, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import globalStyles from '@styles/globalStyles';
import {useFocusEffect} from '@react-navigation/native';
import {verticalMargin} from '@utils/setStyle';
import FilledButton from '@components/FilledButton';
import BackButton from '@components/BackButton';
import BorderInput from '@components/BorderInput';
import AddBankModal from '@features/home/components/AddBankModal';
import {userBankDetails, cashWithdrawal, getUserDetails} from '@queries';
import {useSelector, useDispatch} from 'react-redux';
import {userDetails} from '@redux/actions';
import BankListModal from '@features/home/components/BankListModal';
import Loader from '@components/Loader';
import Link from '@components/Link';
import {JSHash, CONSTANTS} from 'react-native-hash';
import APP_TEXT from '@assets/locale/en';
import CustomSnackbar from '@components/CustomSnackbar';

const Withdraw = ({navigation}) => {
  const [isBankAdd, setIsBankAdd] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [bankDetails, setBankDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState({
    bankId: '',
    bankName: '',
  });
  const [details, setDetails] = useState({
    amount: 0,
    password: '',
    method: '',
  });
  const [cashAmount, setCashAmount] = useState(0);
  const [isBankListModal, setIsBankListModal] = useState(false);
  const userLocalDetails = useSelector(state => state.userDetails.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      details.amount < 1 ||
      details.password === '' ||
      selectedBank === undefined
    ) {
      setIsBtnDisabled(true);
    } else if (parseInt(details.amount, 10) < 300) {
      setIsBtnDisabled(true);
    } else if (
      parseInt(details.amount, 10) > parseInt(userLocalDetails.cashAmount, 10)
    ) {
      setIsBtnDisabled(true);
    } else {
      setIsBtnDisabled(false);
    }
  }, [details]);

  useEffect(() => {
    const deduction = 0.06 * parseFloat(details.amount);
    const finalAmount = parseFloat(details.amount) - deduction;
    setCashAmount(finalAmount);
  }, [details]);

  useFocusEffect(
    React.useCallback(() => {
      fetchBanksList();
    }, []),
  );

  const fetchUserDetails = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    getUserDetails(formData)
      .then(res => {
        if (res && res?.status && res?.wallet_amount) {
          dispatch(
            userDetails({
              ...userLocalDetails,
              walletAmount: res.wallet_amount,
              cashAmount: res.cash_amount,
            }),
          );
        } else {
          CustomSnackbar(String(Object.values(res?.message)));
        }
      })
      .catch(err => {
        console.warn(err);
        CustomSnackbar(APP_TEXT.error.error_text);
      })
      .finally(() => setIsLoading(false));
  };

  const fetchBanksList = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    userBankDetails(formData)
      .then(res => {
        if (res && res?.status && res?.data) {
          let bankArr = [...res.data];
          bankArr = bankArr.map((item, index) => {
            if (index === 0) {
              return {...item, selected: true};
            }
            return {...item, selected: false};
          });
          setBankDetails(bankArr);
          if (res?.data.length !== 0) {
            setSelectedBank({
              ...selectedBank,
              bankId: res.data[0].bankid,
              bankName: res.data[0].bankname,
            });
          }
        }
      })
      .catch(err => console.warn(err))
      .finally(() => {
        fetchUserDetails();
      });
  };

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

  const onSelectBank = item => {
    let bankArr = [...bankDetails];
    bankArr = bankArr.map(bank => {
      if (bank.bankaccount === item.bankaccount) {
        return {...bank, selected: true};
      }
      return {...bank, selected: false};
    });
    setBankDetails(bankArr);
    setSelectedBank({
      ...selectedBank,
      bankId: item?.bankaccount,
      bankName: item?.bankname,
    });
    setIsBankListModal(false);
  };

  const onAddBank = () => {
    setIsBankAdd(false);
    fetchBanksList();
  };

  const onBtnPressed = () => {
    setIsLoading(true);
    const amount = parseFloat(details.amount);
    const formData = new FormData();
    formData.append('mobile', userLocalDetails.mobile);
    formData.append('country_code', '+91');
    formData.append('transfer_type', 'wallet');
    formData.append('transfer_amount', String(amount));
    formData.append('bankid', selectedBank.bankId);
    formData.append('withdrawal_amount', details.amount);
    const checsumMethod =
      userLocalDetails?.mobile + details.amount + selectedBank.bankId + '+91';
    JSHash(checsumMethod, CONSTANTS.HashAlgorithms.sha256)
      .then(hash => {
        formData.append('authchecksum', hash);
      })
      .catch(err => console.warn(err))
      .finally(() => {
        JSHash(details.password, CONSTANTS.HashAlgorithms.sha256)
          .then(res => {
            formData.append('password', res);
          })
          .catch(err => console.warn(err))
          .finally(() => {
            setDetails({
              ...details,
              amount: 0,
              password: '',
            });
            cashWithdrawal(formData)
              .then(res => {
                if (res && res?.status) {
                  CustomSnackbar('Cash withdrawal successful', 1);
                } else {
                  CustomSnackbar(res.message[0]);
                }
              })
              .catch(err => console.warn(err));
          })
          .finally(() => fetchUserDetails());
      });
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerText}>Withdraw</Text>
        </View>
      </View>
      <View style={styles.headerCard}>
        <BorderInput
          placeholder="Withdrawal amount"
          keyboardType="number-pad"
          value={details.amount}
          onChangeText={val =>
            setDetails({
              ...details,
              amount: val,
            })
          }
        />
        <Text style={{fontSize: 12, color: '#090909', marginTop: 5}}>
          <Link
            onPress={() =>
              setDetails({
                ...details,
                amount: userLocalDetails?.cashAmount,
              })
            }>
            Withdraw all{' '}
          </Link>
          ₹{userLocalDetails?.cashAmount}
        </Text>
        <View style={styles.dropdownButtonContainer}>
          <Pressable
            disabled={bankDetails.length === 0}
            style={styles.dropdownButtonStyle}
            onPress={() => setIsBankListModal(true)}>
            <Text style={{color: '#090909'}}>
              {selectedBank.bankName === ''
                ? 'Select bank account'
                : selectedBank.bankName}
            </Text>
          </Pressable>
          <FilledButton
            style={styles.addBankBtn}
            title="Add bank"
            onPress={() => setIsBankAdd(true)}
          />
        </View>
        <BorderInput
          style={verticalMargin(20)}
          placeholder="Payment password"
          secureTextEntry={true}
          value={details.password}
          onChangeText={val =>
            setDetails({
              ...details,
              password: val,
            })
          }
        />
        <Pressable
          style={[
            styles.withdrawalBtn,
            isBtnDisabled && {backgroundColor: 'grey'},
          ]}
          onPress={onBtnPressed}
          disabled={isBtnDisabled}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: 'white',
              textAlign: 'center',
              lineHeight: 20,
            }}>
            ₹{details.amount === '' ? 0 : cashAmount}
            {'\n'}
            WITHDRAWAL CONFIRM
          </Text>
        </Pressable>
        {parseFloat(details.amount) >
          parseFloat(userLocalDetails.cashAmount) && (
          <Text style={{textAlign: 'center', marginTop: 5, color: 'red'}}>
            Insufficient balance
          </Text>
        )}
        {parseFloat(details.amount) < 300 && (
          <Text style={{textAlign: 'center', marginTop: 5, color: 'red'}}>
            Amount should not be less than 300
          </Text>
        )}

        <Text style={{margin: 10, color: '#090909'}}>
          Total cash amount: {userLocalDetails.cashAmount}
        </Text>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: '#dbdbdb',
            width: '100%',
            marginVertical: 20,
          }}
        />
        <Text style={{fontSize: 16, fontWeight: '600', color: '#000'}}>
          Note :
        </Text>
        <Text style={{color: 'grey', marginTop: 5, fontSize: 12}}>
          Service Charge : 6%
        </Text>
        <Text style={{color: 'grey', marginTop: 5, fontSize: 12}}>
          Withdrawal time: Monday to Friday, 9:30 am to 6:00 pm
        </Text>
      </View>
      {isBankAdd && (
        <AddBankModal
          onClose={() => setIsBankAdd(false)}
          onAddBank={onAddBank}
        />
      )}
      {isBankListModal && (
        <BankListModal
          data={bankDetails}
          onPress={item => onSelectBank(item)}
          onClose={() => setIsBankListModal(false)}
        />
      )}
      {isLoading && <Loader />}
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
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginRight: 8,
    marginTop: 20,
  },
  rechargeBtnSelected: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 20,
  },
  inputTitle: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  dropdownButtonContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 12,
    color: '#000',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButtonStyle: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  addBankBtn: {
    marginRight: 10,
    marginVertical: 10,
    width: 110,
  },
  withdrawalBtn: {
    backgroundColor: '#3b7deb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 30,
  },
});

export default Withdraw;
