import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import globalStyles from '@styles/globalStyles';
import images from '@assets/images';
import {setLargeFont} from '@utils/setStyle';
import Loader from '@components/Loader';
import ResponsiveView from '@components/ResponsiveView';

const AuthContainer = ({children, title, isLoading = false}) => {
  return (
    <ResponsiveView>
      <View style={styles.headerContainer}>
        <Image style={globalStyles.logo} source={images.profitplus} />
      </View>
      <View style={styles.mainContainer}>
        <Text style={[setLargeFont()]}>{title}</Text>
        {children}
      </View>
      {isLoading && <Loader />}
    </ResponsiveView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 170,
    alignItems: 'center',
    paddingTop: 20,
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});

export default AuthContainer;
