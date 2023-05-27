import {View, StyleSheet, Keyboard} from 'react-native';
import React, {useState, useEffect} from 'react';
import AuthContainer from './AuthContainer';
import InputText from '@components/InputText';
import images from '@assets/images';
import FilledButton from '@components/FilledButton';
import {RESET_PASSWORD, OTP_VERIFICATION} from '@navigation/screenNames';
import {forgotPassword} from '@queries';
import {JSHash, CONSTANTS} from 'react-native-hash';
import CustomSnackbar from '@components/CustomSnackbar';
import APP_TEXT from '@assets/locale/en';

const ForgotPassword = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    mobile: '',
    countryCode: '+91',
  });
  const [isNavigationDisabled, setIsNavigationDisabled] = useState(true);

  useEffect(() => {
    if (userDetails.mobile.length !== 10) {
      setIsNavigationDisabled(false);
    } else {
      setIsNavigationDisabled(true);
    }
  }, [userDetails]);

  const onContinue = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    JSHash(userDetails.passwd, CONSTANTS.HashAlgorithms.sha256).then(hash => {
      const formData = new FormData();
      formData.append('mobile', userDetails?.mobile);
      formData.append('country_code', userDetails.countryCode);
      forgotPassword(formData)
        .then(res => {
          if (res && res?.status) {
            navigation.navigate(OTP_VERIFICATION, {
              navigateTo: RESET_PASSWORD,
              mobile: userDetails?.mobile,
              country_code: '+91',
              authChecksum: res.authchecksum,
            });
          } else {
            CustomSnackbar(String(Object.values(res?.message)));
          }
        })
        .catch(err => {
          console.warn(err);
          CustomSnackbar(APP_TEXT.error_text);
        })
        .finally(() => setIsLoading(false));
    });
  };
  return (
    <AuthContainer title="Forgot password" isLoading={isLoading}>
      <View style={styles.mainContainer}>
        <InputText
          style={styles.input}
          placeholder="Mobile"
          keyboardType="number-pad"
          source={images.telephone_icon}
          maxLength={10}
          onChangeText={val =>
            setUserDetails({
              ...userDetails,
              mobile: val,
            })
          }
        />
        <FilledButton
          style={styles.btn}
          title="Continue"
          onPress={onContinue}
          disabled={!isNavigationDisabled}
        />
      </View>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 15,
  },
  input: {
    marginTop: 20,
  },
  btn: {
    alignSelf: 'center',
    marginTop: 30,
  },
});

export default ForgotPassword;
