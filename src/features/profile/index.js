import {View, Text, StyleSheet, FlatList, Linking} from 'react-native';
import React, {useState, useEffect} from 'react';
import TabContainer from '@components/TabContainer';
import {setMediumFont} from '@utils/setStyle';
import profileOptions from '@assets/data/profileOptions';
import ListView from './components/ListView';
import globalStyles from '@styles/globalStyles';
import FilledButton from '@components/FilledButton';
import OutlinedButton from '@components/OutlinedButton';
import {
  WITHDRAW,
  HOME_STACK,
  AUTH_STACK,
  SIGNIN,
  RECHARGE_DETAILS,
  TRANSFER_OUT_DETAILS,
  WITHDRAWAL_DETAILS,
  COMMiSSION_HISTORY,
} from '@navigation/screenNames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {CONTACT_NUMBER, STORAGE_KEYS} from '@constants';
import {useSelector, useDispatch} from 'react-redux';
import {userDetails} from '@redux/actions';
import DeviceInfo from 'react-native-device-info';

const Profile = ({navigation}) => {
  const [lastLogin, setLastLogin] = useState('');
  const userLocalDetails = useSelector(state => state.userDetails.data);
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN).then(res => {
      if (res !== null) {
        res = JSON.parse(res);
        setLastLogin(res?.previous);
      }
    });
  }, []);

  const logout = () => {
    AsyncStorage.clear()
      .catch(err => console.warn(err))
      .finally(() => {
        dispatch(userDetails());
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: AUTH_STACK,
                params: {
                  screen: SIGNIN,
                },
              },
            ],
          }),
        );
      });
  };

  const onOptionPressed = item => {
    switch (item.id) {
      case 0:
        return navigation.push(RECHARGE_DETAILS);
      case 1:
        return navigation.push(TRANSFER_OUT_DETAILS);
      case 2:
        return navigation.push(WITHDRAWAL_DETAILS);
      case 3:
        return Linking.openURL(
          `whatsapp://send?text=""&phone=${CONTACT_NUMBER}`,
        );
      case 5:
        logout();
        break;
      case 6:
        return navigation.navigate(COMMiSSION_HISTORY);
      default:
        break;
    }
  };

  const header = () => (
    <View>
      <View style={globalStyles.headerContainer}>
        <View
          style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
          <Text style={{fontSize: 24, fontWeight: '600', color: 'white'}}>
            Profile
          </Text>
        </View>
      </View>
      <View style={globalStyles.headerCard}>
        <Text style={setMediumFont(20, '700')}>
          Account: {userLocalDetails?.mobile}
        </Text>
        <Text style={{color: 'grey', marginTop: 5, fontSize: 12}}>
          Last login {lastLogin}
        </Text>
        <View
          style={{borderWidth: 0.4, borderColor: '#dbdbdb', marginVertical: 20}}
        />
        <View style={styles.btnContainer}>
          <FilledButton
            style={styles.btn}
            title="RECHARGE"
            onPress={() => navigation.navigate(HOME_STACK)}
          />
          <OutlinedButton
            style={styles.btn}
            title="WITHDRAW"
            onPress={() => navigation.navigate(HOME_STACK, {screen: WITHDRAW})}
          />
        </View>
      </View>
    </View>
  );

  const renderOptions = ({item, index}) => {
    let style = {};
    if (index === 0) {
      style = {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      };
    } else if (index === profileOptions.length - 1) {
      style = {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      };
    }
    return (
      <ListView
        item={item}
        onPress={val => onOptionPressed(val)}
        style={style}
      />
    );
  };

  const footerComponent = () => (
    <Text style={{marginVertical: 10, color: 'grey', textAlign: 'center'}}>
      App version {DeviceInfo.getVersion()}
    </Text>
  );

  return (
    <TabContainer>
      <FlatList
        data={profileOptions}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 10}}
        keyExtractor={item => item.id}
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderWidth: 0.3,
              borderColor: '#dbdbdb',
              marginHorizontal: 20,
            }}
          />
        )}
        ListFooterComponent={footerComponent}
        renderItem={renderOptions}
      />
    </TabContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#3b7deb',
    height: 150,
  },
  headerCard: {
    width: '90%',
    backgroundColor: 'white',
    paddingVertical: 20,
    alignSelf: 'center',
    borderRadius: 12,
    top: -30,
    paddingHorizontal: 20,
    elevation: 2,
  },
  cardBtnContainer: {
    backgroundColor: '#3b7deb',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 30,
    borderRadius: 12,
  },
  bannerIcon: {
    width: 100,
    height: 100,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default Profile;
