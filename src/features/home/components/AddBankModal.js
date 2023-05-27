import {View, Text, Dimensions, StyleSheet, Keyboard} from 'react-native';
import React, {useState, useEffect} from 'react';
import BorderInput from '@components/BorderInput';
import {verticalMargin, horizontalMargin} from '@utils/setStyle';
import OutlinedButton from '@components/OutlinedButton';
import FilledButton from '@components/FilledButton';
import {addBank} from '@queries';
import {useSelector} from 'react-redux';
import CustomSnackbar from '@components/CustomSnackbar';
import APP_TEXT from '@assets/locale/en';
import {alphanumericValidation} from '@utils/validations';
import Loader from '@components/Loader';

const AddBankModal = ({onClose, onAddBank}) => {
  const userLocalDetails = useSelector(state => state.userDetails.data);
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accHolderName: '',
    bankName: '',
    accNumber: '',
    ifscCode: '',
  });

  useEffect(() => {
    if (
      bankDetails.accHolderName === '' ||
      bankDetails.bankName === '' ||
      bankDetails.accNumber === '' ||
      bankDetails.ifscCode === ''
    ) {
      setIsBtnDisabled(true);
    } else {
      setIsBtnDisabled(false);
    }
  }, [bankDetails]);

  const validateDetails = () => {
    Keyboard.dismiss();
    if (
      bankDetails.accHolderName === '' ||
      bankDetails.bankName === '' ||
      bankDetails.accNumber === '' ||
      bankDetails.ifscCode === ''
    ) {
      CustomSnackbar(APP_TEXT.fill_details, 1);
    } else if (alphanumericValidation(bankDetails.ifscCode)) {
    }
    handleAddBank();
  };

  const handleAddBank = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    formData.append('bank_name', bankDetails.bankName);
    formData.append('bank_account', bankDetails.accNumber);
    formData.append('bank_user', bankDetails.accHolderName);
    formData.append('bank_ifsc', bankDetails.ifscCode);
    addBank(formData)
      .then(res => {
        if (res && res?.status) {
          CustomSnackbar('Bank added successfully', 1);
        } else {
          CustomSnackbar(APP_TEXT.error_text);
        }
      })
      .catch(err => {
        console.warn(err);
        CustomSnackbar(APP_TEXT.error_text);
      })
      .finally(() => {
        setIsLoading(false);
        onAddBank();
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Add Bank</Text>
        </View>
        <View style={horizontalMargin(20, 20)}>
          <BorderInput
            placeholder="Acc. holder name"
            style={verticalMargin(20)}
            onChangeText={val =>
              setBankDetails({
                ...bankDetails,
                accHolderName: val,
              })
            }
          />
          <BorderInput
            placeholder="Bank name"
            style={verticalMargin(20)}
            onChangeText={val =>
              setBankDetails({
                ...bankDetails,
                bankName: val,
              })
            }
          />
          <BorderInput
            placeholder="Account number"
            style={verticalMargin(20)}
            keyboardType="number-pad"
            maxLength={16}
            onChangeText={val =>
              setBankDetails({
                ...bankDetails,
                accNumber: val,
              })
            }
          />
          <BorderInput
            placeholder="IFSC code"
            style={verticalMargin(20)}
            onChangeText={val =>
              setBankDetails({
                ...bankDetails,
                ifscCode: val,
              })
            }
          />
          <View style={styles.btnContainer}>
            <OutlinedButton
              style={styles.btn}
              title="Close"
              onPress={onClose}
            />
            <FilledButton
              disabled={isBtnDisabled}
              style={styles.btn}
              title="Add"
              onPress={validateDetails}
            />
          </View>
        </View>
      </View>
      {isLoading && <Loader />}
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    elevation: 4,
  },
  innerContainer: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    width: windowWidth - 40,
    borderRadius: 12,
  },
  headerContainer: {
    backgroundColor: 'green',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  btnContainer: {
    flexDirection: 'row',
    marginVertical: 30,
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default AddBankModal;
