import {View, Text, StyleSheet, Keyboard, Linking} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import AuthContainer from './AuthContainer';
import InputText from '@components/InputText';
import images from '@assets/images';
import Link from '@components/Link';
import FilledButton from '@components/FilledButton';
import {INITIAL_SCREEN, SIGNUP} from '@navigation/screenNames';
import {login} from '@queries';
import {JSHash, CONSTANTS} from 'react-native-hash';
import {STORAGE_KEYS, CONTACT_NUMBER} from '@constants';
import {setStorageString, setStorageObject} from '@utils/handleLocalStorage';
import CustomSnackbar from '@components/CustomSnackbar';
import APP_TEXT from '@assets/locale/en';
import {useDispatch} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import {userDetails as userLocalDetails} from '@redux/actions';
import {AppContext} from '@context';

const Signin = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    mobile: null,
    countryCode: '+91',
    passwd: '',
  });
  const [isNavigationDisabled, setIsNavigationDisabled] = useState(true);
  const {setResponse} = useContext(AppContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userDetails.mobile !== null && userDetails.passwd !== '') {
      setIsNavigationDisabled(false);
    }
  }, [userDetails]);

  const onContinue = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    JSHash(userDetails.passwd, CONSTANTS.HashAlgorithms.sha256).then(hash => {
      const formData = new FormData();
      formData.append('mobile', userDetails.mobile);
      formData.append('country_code', userDetails.countryCode);
      formData.append('password', hash);
      login(formData)
        .then(res => {
          if (res && res?.status) {
            const localDetails = {
              mobile: userDetails.mobile,
            };
            setStorageObject(STORAGE_KEYS.USER_DETAILS, localDetails);
            dispatch(userLocalDetails(localDetails));
            setStorageString(STORAGE_KEYS.ACCESS_TOKEN, res.token);
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: INITIAL_SCREEN,
                  },
                ],
              }),
            );
          } else {
            setResponse(String(Object.values(res?.message)));
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
    <AuthContainer title="Sign in" isLoading={isLoading}>
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
        <InputText
          style={styles.input}
          placeholder="Password"
          source={images.lock_icon}
          secureTextEntry={true}
          onChangeText={val =>
            setUserDetails({
              ...userDetails,
              passwd: val,
            })
          }
        />
        <Link
          style={styles.link}
          onPress={() =>
            Linking.openURL(`whatsapp://send?text=""&phone=${CONTACT_NUMBER}`)
          }>
          Forgot Password
        </Link>
        <FilledButton
          style={styles.btn}
          title="Continue"
          onPress={onContinue}
          disabled={isNavigationDisabled}
        />
        <Text style={styles.bottomText}>
          Don't have an account?{' '}
          <Link onPress={() => navigation.navigate(SIGNUP)}>Sign up</Link>
        </Text>
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
  link: {
    marginTop: 15,
    textAlign: 'right',
  },
  btn: {
    alignSelf: 'center',
    marginTop: 20,
  },
  bottomText: {
    fontSize: 14,
    color: 'rgb(46, 45, 44)',
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default Signin;
