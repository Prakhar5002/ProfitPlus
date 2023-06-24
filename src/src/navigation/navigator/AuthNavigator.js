import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {slideLeft} from '../screenOptions';
import {
  OTP_VERIFICATION,
  SIGNIN,
  SIGNUP,
  AUTHENTICATION,
  RESET_PASSWORD,
  FORGOT_PASSWORD,
} from '../screenNames';
import Signin from '@features/authentication/Signin';
import Signup from '@features/authentication/Signup';
import Authentication from '@features/authentication';
import ResetPassword from '@features/authentication/ResetPassword';
import ForgotPassword from '@features/authentication/ForgotPassword';

const Stack = createNativeStackNavigator();

const AuthStack = ({route}) => {
  return (
    <Stack.Navigator screenOptions={slideLeft}>
      <Stack.Screen name={AUTHENTICATION} component={Authentication} />
      <Stack.Screen name={SIGNUP} component={Signup} />
      <Stack.Screen name={SIGNIN} component={Signin} />
      <Stack.Screen name={RESET_PASSWORD} component={ResetPassword} />
      <Stack.Screen name={FORGOT_PASSWORD} component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
