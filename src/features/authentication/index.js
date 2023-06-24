import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import React from 'react';
import globalStyles from '@styles/globalStyles';
import {setMediumFont} from '@utils/setStyle';
import images from '@assets/images';
import {SIGNUP} from '@navigation/screenNames';

const Authentication = ({navigation}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={globalStyles.center}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={images.profitplus}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={[setMediumFont(18, '600'), styles.bottomText]}>
          Ready to go?
        </Text>
        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate(SIGNUP)}>
          <Text style={styles.btnText}>Let's Get Started</Text>
          <Image style={styles.btnIcon} source={images.chevron_right} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  bottomContainer: {
    height: 200,
    backgroundColor: '#f2f5fe',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
  },
  bottomText: {
    textAlign: 'center',
  },
  btn: {
    width: '90%',
    backgroundColor: '#3b7deb',
    alignSelf: 'center',
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    flexDirection: 'row',
  },
  btnText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  btnIcon: {
    width: 22,
    height: 22,
    tintColor: 'white',
  },
  logo: {
    width: 300,
    height: 200,
  },
});

export default Authentication;
