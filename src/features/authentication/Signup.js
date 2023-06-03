import {View, Text, StyleSheet, Keyboard} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import AuthContainer from './AuthContainer';
import InputText from '@components/InputText';
import images from '@assets/images';
import Link from '@components/Link';
import FilledButton from '@components/FilledButton';
import {BOTTOM_TAB, SIGNIN} from '@navigation/screenNames';
import {registerUser} from '@queries';
import {setStorageObject, setStorageString} from '@utils/handleLocalStorage';
import {JSHash, CONSTANTS} from 'react-native-hash';
import {STORAGE_KEYS} from '@constants';
import CustomSnackbar from '@components/CustomSnackbar';
import {userDetails as userLocalDetails} from '@redux/actions';
import {passwordValidation} from '@utils/validations';
import APP_TEXT from '@assets/locale/en';
import {useDispatch} from 'react-redux';
import {AppContext} from '@context';

const Signup = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    country_code: '+91',
    mobile: null,
    passwd: '',
    confirm_passwd: '',
    referalCode: undefined,
  });
  const [isNavigationDisabled, setIsNavigationDisabled] = useState(true);
  const {setResponse} = useContext(AppContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      userDetails.name !== '' &&
      userDetails.mobile !== null &&
      userDetails.passwd !== '' &&
      userDetails.confirm_passwd !== ''
    ) {
      setIsNavigationDisabled(false);
    }
  }, [userDetails]);

  const validateDetails = () => {
    const {name, mobile, passwd, confirm_passwd} = userDetails;
    const validatePassword = passwordValidation(passwd);
    if (
      name === '' ||
      mobile === null ||
      passwd === '' ||
      confirm_passwd === ''
    ) {
      setResponse('Please fill the details');
      return false;
    } else if (!name.match(/^[A-Za-z\s]*$/)) {
      setResponse('Username must contain alphabets only (eg:- Test)');
      return false;
    } else if (passwd !== confirm_passwd) {
      setResponse("Passwords doesn't match");
      return false;
    } else if (mobile.length !== 10) {
      setResponse('Please enter a valid mobile number');
      return false;
    } else if (!validatePassword) {
      setResponse(APP_TEXT.error.password_validation);
      return false;
    } else if (name.length < 3) {
      setResponse('Username must be atleast 3 charecters long');
      return false;
    } else {
      return true;
    }
  };

  const handleRegisterUser = () => {
    const formData = new FormData();
    formData.append('name', userDetails.name);
    formData.append('mobile', userDetails.mobile);
    formData.append('country_code', userDetails.country_code);
    if (userDetails.referalCode) {
      formData.append('referralCode', userDetails.referalCode);
    }
    JSHash(userDetails.passwd, CONSTANTS.HashAlgorithms.sha256)
      .then(paswdHash => {
        formData.append('password', paswdHash);
        formData.append('cpassword', paswdHash);
      })
      .catch(err => console.warn(err))
      .finally(() => {
        const checkSumMethod =
          userDetails.country_code + userDetails.mobile + userDetails.name;
        JSHash(checkSumMethod, CONSTANTS.HashAlgorithms.sha256)
          .then(checksum => {
            formData.append('authchecksum', checksum);
          })
          .catch(err => console.warn(err))
          .finally(() => {
            registerUser(formData)
              .then(res => {
                if (res && res?.status) {
                  const localDetails = {
                    mobile: userDetails.mobile,
                  };
                  setStorageObject(STORAGE_KEYS.USER_DETAILS, localDetails);
                  setStorageString(STORAGE_KEYS.ACCESS_TOKEN, 'signup_token');
                  dispatch(userLocalDetails(localDetails));
                  navigation.navigate(BOTTOM_TAB);
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
      });
  };

  const onContinue = () => {
    Keyboard.dismiss();
    if (validateDetails()) {
      setIsLoading(true);
      handleRegisterUser();
    }
  };

  return (
    <AuthContainer title="Sign up" isLoading={isLoading}>
      <View style={styles.mainContainer}>
        <InputText
          style={styles.input}
          placeholder="Full name"
          source={images.user_icon}
          onChangeText={val =>
            setUserDetails({
              ...userDetails,
              name: val,
            })
          }
        />
        {!userDetails.name.match(/^[A-Za-z\s]*$/) &&
          userDetails.name !== '' && (
            <Text style={{color: 'red', textAlign: 'center', marginTop: 3}}>
              Username must contain alphabets only
            </Text>
          )}

        <InputText
          style={styles.input}
          placeholder="Mobile"
          source={images.telephone_icon}
          keyboardType="number-pad"
          onChangeText={val =>
            setUserDetails({
              ...userDetails,
              mobile: val,
            })
          }
          maxLength={10}
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
        <InputText
          style={styles.input}
          placeholder="Confirm Password"
          source={images.lock_icon}
          secureTextEntry={true}
          onChangeText={val =>
            setUserDetails({
              ...userDetails,
              confirm_passwd: val,
            })
          }
        />

        <InputText
          style={styles.input}
          placeholder="Referal code (optional)"
          source={images.refer_icon}
          onChangeText={val =>
            setUserDetails({
              ...userDetails,
              referalCode: val,
            })
          }
        />
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.text}>
            By signing up, you agree to our <Link>Terms & Conditions</Link> and{' '}
            <Link>Privacy Policy</Link>.
          </Text>
        </View>
        <FilledButton
          style={styles.btn}
          title="Continue"
          onPress={onContinue}
          disabled={isNavigationDisabled}
        />
        <Text style={styles.bottomText}>
          Already a user?{' '}
          <Link onPress={() => navigation.navigate(SIGNIN)}>Sign in</Link>
        </Text>
      </View>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    color: 'rgb(46, 45, 44)',
    marginVertical: 20,
    lineHeight: 20,
  },
  mainContainer: {
    flex: 1,
    marginTop: 15,
  },
  btn: {
    alignSelf: 'center',
    marginTop: 10,
  },
  bottomText: {
    fontSize: 14,
    color: 'rgb(46, 45, 44)',
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default Signup;
