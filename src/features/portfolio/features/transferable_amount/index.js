import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Keyboard,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import globalStyles from '@styles/globalStyles';
import {verticalMargin} from '@utils/setStyle';
import FilledButton from '@components/FilledButton';
import BackButton from '@components/BackButton';
import {transferableAmount} from '@queries';
import {useSelector} from 'react-redux';
import {JSHash, CONSTANTS} from 'react-native-hash';
import Loader from '@components/Loader';
import CustomSnackbar from '@components/CustomSnackbar';
import {capitalize} from '@utils';
import AccountOptionsModal from '@features/portfolio/components/AccountOptionsModal';
import BorderInput from '@components/BorderInput';
import {transferOutAmount} from '@queries';
import APP_TEXT from '@assets/locale/en';

const TranferableAmount = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAccOptionModal, setIsAccOptionModal] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [accOptions, setAccOptions] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedOption, setSelectedOption] = useState({
    amount: 0,
    option_key: '',
  });

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

  useEffect(() => {
    if (userLocalDetails?.mobile) {
      fetchTransferableAmount();
    }
  }, []);

  useEffect(() => {
    if (
      parseInt(selectedAmount, 10) > parseInt(selectedOption.amount, 10) ||
      selectedAmount === 0
    ) {
      setIsBtnDisabled(true);
    } else {
      setIsBtnDisabled(false);
    }
  }, [selectedAmount, selectedOption]);

  const fetchTransferableAmount = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    transferableAmount(formData)
      .then(res => {
        if (res && res?.status) {
          const responseData = [];
          for (let i = 0; i < Object.keys(res.data).length; i++) {
            const obj = Object.values(res.data)[i];
            if (i === 0) {
              obj.selected = true;
            } else {
              obj.selected = false;
            }
            responseData.push(obj);
          }
          setAccOptions(responseData);
          setSelectedOption(responseData[0]);
        }
      })
      .catch(err => console.warn(err))
      .finally(() => {
        setSelectedAmount(0);
        setIsLoading(false);
      });
  };

  const handleAmountSelect = val => {
    val = val.replace(/^0+/, '');
    if (parseInt(val, 10) <= 0 || val === '') {
      setSelectedAmount(0);
    } else {
      setSelectedAmount(val);
    }
  };

  const onSelectAccount = item => {
    setIsAccOptionModal(false);
    setSelectedOption(item);
    let optionsArr = [...accOptions];
    optionsArr = optionsArr.map(option => {
      if (item.option_key === option.option_key) {
        return {...option, selected: true};
      }
      return {...option, selected: false};
    });
    setAccOptions(optionsArr);
  };

  const onTransferOut = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    formData.append('transfer_type', selectedOption.option_key);
    formData.append('transfer_amount', selectedAmount);
    const checksumKey =
      userLocalDetails?.mobile +
      selectedOption.option_key +
      selectedAmount +
      '+91';
    JSHash(checksumKey, CONSTANTS.HashAlgorithms.sha256)
      .then(localRes => {
        formData.append('authchecksum', localRes);
      })
      .catch(err => console.warn(err))
      .finally(() => {
        transferOutAmount(formData)
          .then(res => {
            if (res && res?.status) {
              CustomSnackbar('Amount transfer out Successful', 1);
            } else {
              CustomSnackbar('Some error occurred!!');
            }
          })
          .catch(err => {
            console.warn(err);
            CustomSnackbar(APP_TEXT.error_text);
          })
          .finally(() => {
            fetchTransferableAmount();
            setIsLoading(false);
          });
      });
  };

  if (isLoading) {
    return <Loader isTransparent={false} />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerText}>Transfer out amount</Text>
        </View>
      </View>
      <View style={styles.headerCard}>
        <Pressable
          style={styles.dropdownButtonStyle}
          onPress={() => setIsAccOptionModal(true)}>
          <Text style={{color: '#000'}}>
            {accOptions.length > 0 &&
              '(₹' +
                selectedOption.amount +
                ') - ' +
                capitalize(selectedOption.option_key)}
          </Text>
        </Pressable>
        <BorderInput
          placeholder="Enter your amount"
          style={{width: '95%', marginTop: 20}}
          onChangeText={val => handleAmountSelect(val)}
          keyboardType="number-pad"
          value={String(selectedAmount)}
        />
        <Text
          style={{
            color: 'red',
            marginTop: 5,
            opacity:
              parseInt(selectedAmount) > parseInt(selectedOption.amount)
                ? 1
                : 0,
          }}>
          Insufficient balance
        </Text>
        <FilledButton
          disabled={isBtnDisabled}
          style={verticalMargin(20)}
          title="TRANSFER OUT"
          onPress={onTransferOut}
        />

        <Text style={{marginTop: 10}}>
          Cash account : {'₹' + selectedAmount}
        </Text>
      </View>
      {isAccOptionModal && (
        <AccountOptionsModal
          data={accOptions}
          onPress={item => onSelectAccount(item)}
          onClose={() => setIsAccOptionModal(false)}
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
    width: '95%',
    top: -30,
    backgroundColor: 'white',
    paddingVertical: 20,
    alignSelf: 'center',
    alignItems: 'center',
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
  dropdownButtonStyle: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
    width: '95%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

export default TranferableAmount;
