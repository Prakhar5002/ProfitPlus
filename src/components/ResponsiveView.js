/* eslint-disable react-native/no-inline-styles */
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Platform,
} from 'react-native';
import React from 'react';
import globalStyles from '@styles/globalStyles';
import Loader from '@components/Loader';

//Use it in the screens having TextInput
const ResponsiveView = ({children, style, isLoading = false}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' && 'padding'}
      style={globalStyles.container}
      keyboardVerticalOffset={70}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={style}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{flexGrow: 1}}>
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
      {isLoading && <Loader />}
    </KeyboardAvoidingView>
  );
};

export default ResponsiveView;
