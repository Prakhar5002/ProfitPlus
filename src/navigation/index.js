import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  BOTTOM_TAB,
  AUTH_STACK,
  ORDERS,
  HOME_STACK,
  INITIAL_SCREEN,
  PACKAGE_DETAILS,
  TRANSFERABLE_AMOUNT,
  MY_PLAN,
  PAYMENT_WEBVIEW,
  RECHARGE_DETAILS,
  TRANSFER_OUT_DETAILS,
  WITHDRAWAL_DETAILS,
} from './screenNames';
import AuthStack from './navigator/AuthNavigator';
import {defaultOptions} from './screenOptions';
import BottomTabStack from './navigator/BottomTabNavigator';
import HomeStack from './navigator/HomeNavigator';
import Orders from '@features/orders';
import Splash from '@components/Splash';
import InitialScreen from '@features/authentication/InitialScreen';
import PackageDetails from '@components/PackageDetails';
import TranferableAmount from '@features/portfolio/features/transferable_amount';
import MyPlan from '@features/portfolio/features/my_plan';
import MainContainer from '@components/MainContainer';
import PaymentWebview from '@components/PaymentWebview';
import RechargeDetails from '@features/profile/features/recharge_details';
import TransferDetails from '@features/profile/features/transfer_details';
import WithdrawalDetails from '@features/profile/features/withdrawal_details';

const MainStack = () => {
  const Stack = createNativeStackNavigator();
  const [isSplash, setIsSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsSplash(false);
    }, 3000);
  }, []);

  if (isSplash) {
    return <Splash />;
  }

  return (
    <MainContainer>
      <Stack.Navigator screenOptions={defaultOptions}>
        <Stack.Screen name={INITIAL_SCREEN} component={InitialScreen} />
        <Stack.Screen name={AUTH_STACK} component={AuthStack} />
        <Stack.Screen name={BOTTOM_TAB} component={BottomTabStack} />
        <Stack.Screen name={HOME_STACK} component={HomeStack} />
        <Stack.Screen name={ORDERS} component={Orders} />
        <Stack.Screen name={PACKAGE_DETAILS} component={PackageDetails} />
        <Stack.Screen
          name={TRANSFERABLE_AMOUNT}
          component={TranferableAmount}
        />
        <Stack.Screen name={MY_PLAN} component={MyPlan} />
        <Stack.Screen name={PAYMENT_WEBVIEW} component={PaymentWebview} />
        <Stack.Screen name={RECHARGE_DETAILS} component={RechargeDetails} />
        <Stack.Screen name={TRANSFER_OUT_DETAILS} component={TransferDetails} />
        <Stack.Screen name={WITHDRAWAL_DETAILS} component={WithdrawalDetails} />
      </Stack.Navigator>
    </MainContainer>
  );
};

export default MainStack;
