import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainStack from '@navigation';
import {Provider} from 'react-redux';
import configureStore from '@redux/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  const store = configureStore();
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
