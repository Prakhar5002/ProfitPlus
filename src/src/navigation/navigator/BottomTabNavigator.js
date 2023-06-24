/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {Image, BackHandler, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabConfig} from '@configs';
import colors from '@styles/colors';

const TabNavigationStack = createBottomTabNavigator();
const BottomTabStack = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <TabNavigationStack.Navigator
      screenOptions={({route}) => {
        const tab = BottomTabConfig.find(({name}) => name === route.name);
        if (tab === undefined) return {};
        return {
          headerShown: false,
          tabBarStyle: {
            borderWidth: 0,
            elevation: 0,
            backgroundColor: 'white',
            borderTopWidth: 0,
            height: 60,
          },
          tabBarLabelStyle: {
            marginBottom: 5,
            fontWeight: '500',
          },
          tabBarIcon: ({focused}) => (
            <Image
              source={tab.icon}
              style={{
                width: 22,
                height: 22,
                tintColor: focused ? '#3b7deb' : colors.GREY_ACTION,
                resizeMode: 'contain',
              }}
            />
          ),
        };
      }}>
      {BottomTabConfig.map(({screen, name}) => (
        <TabNavigationStack.Screen key={name} name={name} component={screen} />
      ))}
    </TabNavigationStack.Navigator>
  );
};

export default BottomTabStack;
