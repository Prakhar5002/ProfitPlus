import React, {useState, useEffect, useContext} from 'react';
import {SafeAreaView} from 'react-native';
import globalStyles from '@styles/globalStyles';
import {AppContext} from '@context';
import {RESPONSE_MSG} from '@constants';
import CustomModal from '@components/CustomModal';

const MainContainer = ({children}) => {
  const [response, setResponse] = useState(RESPONSE_MSG.NONE);

  const value = {
    response,
    setResponse,
  };

  return (
    <AppContext.Provider value={value}>
      <SafeAreaView style={globalStyles.container}>
        {children}
        {response !== RESPONSE_MSG.NONE && (
          <CustomModal
            onPress={() => setResponse(RESPONSE_MSG.NONE)}
            message={response}
          />
        )}
      </SafeAreaView>
    </AppContext.Provider>
  );
};

export default MainContainer