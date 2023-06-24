import {View, StyleSheet, Keyboard} from 'react-native';
import React, {useState, useEffect} from 'react';
import AuthContainer from './AuthContainer';
import InputText from '@components/InputText';
import images from '@assets/images';
import FilledButton from '@components/FilledButton';
import {SIGNIN} from '@navigation/screenNames';
import CustomSnackbar from '@components/CustomSnackbar';
import {updatePassword} from '@queries';
import {JSHash, CONSTANTS} from 'react-native-hash';

const ResetPassword = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwd, setPasswd] = useState('');
  const [confirmPasswd, setConfirmPasswd] = useState('');
  const [isNavigationDisabled, setIsNavigationDisabled] = useState(true);
  const {mobile, country_code} = route?.params ?? null;

  useEffect(() => {
    if (passwd !== '' && confirmPasswd !== '') {
      setIsNavigationDisabled(false);
    }
  }, [passwd, confirmPasswd]);

  const onContinue = () => {
    Keyboard.dismiss();
    if (passwd === confirmPasswd) {
      setIsLoading(true);
      update();
    } else {
      CustomSnackbar("Passwords doesn't match");
    }
  };

  const update = () => {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('country_code', country_code);
    JSHash(passwd, CONSTANTS.HashAlgorithms.sha256)
      .then(res => {
        formData.append('password', res);
        formData.append('cpassword', res);
      })
      .catch(err => console.warn(err))
      .finally(() => {
        updatePassword(formData)
          .then(res => {
            if (res && res?.status) {
              navigation.navigate(SIGNIN);
            } else {
              CustomSnackbar(String(Object.values(res?.message)));
            }
          })
          .catch(err => console.warn(err))
          .finally(() => setIsLoading(false));
      });
  };

  return (
    <AuthContainer title="Set Password" isLoading={isLoading}>
      <View style={styles.mainContainer}>
        <InputText
          style={styles.input}
          placeholder="Password"
          source={images.lock_icon}
          secureTextEntry={true}
          onChangeText={val => setPasswd(val)}
        />
        <InputText
          style={styles.input}
          placeholder="Confirm Password"
          source={images.lock_icon}
          secureTextEntry={true}
          onChangeText={val => setConfirmPasswd(val)}
        />
        <FilledButton
          style={styles.btn}
          title="Continue"
          onPress={onContinue}
          disabled={isNavigationDisabled}
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
  btn: {
    alignSelf: 'center',
    marginTop: 30,
  },
  input: {
    marginTop: 20,
  },
});

export default ResetPassword;
