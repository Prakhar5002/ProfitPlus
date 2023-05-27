import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RECHARGE, WITHDRAW} from '@navigation/screenNames';
import Recharge from '@features/home/features/recharge';
import Withdraw from '@features/home/features/withdraw';
import {defaultOptions} from '@navigation/screenOptions';

const Stack = createNativeStackNavigator();

const HomeStack = ({route}) => {
  const screenName = route?.params?.screen ?? RECHARGE;
  return (
    <Stack.Navigator
      initialRouteName={screenName}
      screenOptions={defaultOptions}>
      <Stack.Screen name={RECHARGE} component={Recharge} />
      <Stack.Screen name={WITHDRAW} component={Withdraw} />
    </Stack.Navigator>
  );
};

export default HomeStack;
