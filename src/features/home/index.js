import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import images from '@assets/images';
import globalStyles from '@styles/globalStyles';
import TabContainer from '@components/TabContainer';
import {setSmallFont, setMediumFont} from '@utils/setStyle';
import {setStorageString} from '@utils/handleLocalStorage';
import FilledButton from '@components/FilledButton';
import OutlinedButton from '@components/OutlinedButton';
import news from '@assets/data/news';
import News from './components/News';
import InfoText from '@components/InfoText';
import InvestPlan from '@components/InvestPlan';
import OptionsHeader from '@components/OptionsHeader';
import Banner from './components/Banner';
import {
  WITHDRAW,
  HOME_STACK,
  PACKAGE_DETAILS,
  BOTTOM_TAB,
} from '@navigation/screenNames';
import {getPackageList, checkOrderStatus, paymentResponse} from '@queries';
import Loader from '@components/Loader';
import {getUserDetails, getNews} from '@queries';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {userDetails} from '@redux/actions';
import CustomSnackbar from '@components/CustomSnackbar';
import APP_TEXT from '@assets/locale/en';
import {STORAGE_KEYS} from '@constants';
import InitialPopup from './components/InitialPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {JSHash, CONSTANTS} from 'react-native-hash';
import NoConnection from '@components/NoConnection';

const Home = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [popularPlans, setPopularPlans] = useState([]);
  const [isInitialPopup, setIsInitialPopup] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const userLocalDetails = useSelector(state => state.userDetails.data);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      if (userLocalDetails?.mobile) {
        fetchUserDetails();
      }
    }, []),
  );

  useEffect(() => {
    getNews()
      .then(res => {
        if (res && res?.status) {
          setNewsData(res?.data);
        }
      })
      .catch(err => console.warn(err))
      .finally(() => {
        AsyncStorage.getItem(STORAGE_KEYS.PENDING_TRANSACTION)
          .then(localRes => {
            if (localRes !== null) {
              checkStatus();
            }
          })
          .catch(err => console.warn(err));
      });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserDetails();
  }, []);

  const handleInitialPopup = () => {
    AsyncStorage.getItem(STORAGE_KEYS.INITIAL_MESSAGE).then(res => {
      if (res === null) {
        setStorageString(STORAGE_KEYS.INITIAL_MESSAGE, 'true');
        setTimeout(() => {
          setIsInitialPopup(true);
        }, 1000);
      }
    });
  };

  const fetchPaymentResponse = (txnId, data, localRes) => {
    const formData = new FormData();
    formData.append('mobile', userLocalDetails.mobile);
    formData.append('country_code', '+91');
    formData.append('client_txn_id', txnId);
    formData.append('status_data', JSON.stringify(data));
    const hashKey = '+91' + txnId + userLocalDetails?.mobile;
    JSHash(hashKey, CONSTANTS.HashAlgorithms.sha256)
      .then(hash => {
        formData.append('authchecksum', hash);
      })
      .catch(err => console.warn(err))
      .finally(() => {
        paymentResponse(formData)
          .then(res => {
            // Alert.alert('some response getting')
          })
          .catch(err => {
            console.warn(err);
          });
      });
  };

  const checkStatus = () => {
    AsyncStorage.getItem(STORAGE_KEYS.PENDING_TRANSACTION).then(localRes => {
      if (localRes !== null && localRes?.length > 0) {
        localRes = JSON.parse(localRes);
        for (let i = 0; i < localRes.length; i++) {
          const jsonData = {
            key: '9e384614-47d4-49b8-9664-8e93c55940e9',
            client_txn_id: localRes[i]?.txnId,
            txn_date: localRes[i]?.currentDate,
          };
          checkOrderStatus(jsonData)
            .then(res => {
              if (res && res?.status) {
                fetchPaymentResponse(localRes[i]?.txnId, res, localRes);
              }
            })
            .catch(err => {
              console.warn(err);
            })
            .finally(() => {
              AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTION_DETAILS);
            });
        }
      }
    });
  };

  const fetchPackageList = () => {
    getPackageList()
      .then(res => {
        if (res && res?.status) {
          setPopularPlans(res?.data);
        }
      })
      .catch(err => console.warn(err))
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
        handleInitialPopup();
      });
  };

  const fetchUserDetails = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    getUserDetails(formData)
      .then(res => {
        if (res && res?.status && res?.wallet_amount) {
          dispatch(
            userDetails({
              ...userLocalDetails,
              walletAmount: res.wallet_amount,
              username: res.name,
              referalCode: res.referral_code,
              cashAmount: res.cash_amount,
            }),
          );
        } else {
          fetchUserDetails();
        }
      })
      .catch(err => {
        console.warn(err);
        setIsConnected(false);
        CustomSnackbar(APP_TEXT.error.error_text);
      })
      .finally(() => fetchPackageList());
  };

  if (!isConnected) {
    return <NoConnection onPress={onRefresh} />;
  }

  const header = () => (
    <View>
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.header}>
          <Text style={globalStyles.headerText}>
            Profit<Text style={{fontSize: 20, fontStyle: 'italic'}}>plus</Text>
          </Text>
        </View>
      </View>
      <InfoText />
      <Pressable activeOpacity={0.9} style={[styles.headerCard]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={globalStyles.container}>
            <Text style={[setSmallFont(14), {color: 'grey'}]}>
              Wallet balance
            </Text>
            <Text style={setMediumFont(20, '700')}>
              ₹{String(userLocalDetails?.walletAmount)}
            </Text>
          </View>
          <Pressable
            style={styles.cardBtnContainer}
            onPress={() =>
              navigation.navigate(BOTTOM_TAB, {
                screen: 'Portfolio',
              })
            }>
            <Image
              style={[globalStyles.icon, {tintColor: 'white'}]}
              source={images.right_arrow}
            />
          </Pressable>
        </View>
      </Pressable>
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
      <OptionsHeader
        style={{marginTop: 20, marginHorizontal: 20}}
        title="Popular Plans"
        onPress={() =>
          navigation.navigate(BOTTOM_TAB, {
            screen: 'Invest',
          })
        }
      />
      <FlatList
        data={popularPlans}
        keyExtractor={item => item.id}
        renderItem={renderPlans}
      />

      {/* <Banner style={{marginTop: 30}} /> */}
    </View>
  );

  const renderNews = ({item, index}) => {
    let isImageAlignLeft = true;
    if (index % 2 === 0) {
      isImageAlignLeft = false;
    }
    return (
      <View>
        {index === 0 && (
          <OptionsHeader
            style={{marginTop: 15, marginHorizontal: 20}}
            title="Latest News"
            isMore={false}
          />
        )}
        <View style={{marginVertical: 3}}>
          <News
            text={item?.content}
            source={item?.image}
            date={item?.date}
            left={isImageAlignLeft}
          />
        </View>
      </View>
    );
  };

  const renderPlans = ({item}) => (
    <InvestPlan
      item={item}
      onPress={packageData =>
        navigation.push(PACKAGE_DETAILS, {
          data: packageData,
        })
      }
    />
  );

  if (isLoading) {
    return <Loader isTransparent={false} />;
  }

  return (
    <TabContainer>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={header}
        data={newsData}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderNews}
      />
      {isInitialPopup && (
        <InitialPopup onClose={() => setIsInitialPopup(false)} />
      )}
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
  header: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  headerCard: {
    width: '90%',
    backgroundColor: 'white',
    paddingVertical: 20,
    alignSelf: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    elevation: 2,
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowColor: 'black',
  },
  cardBtnContainer: {
    backgroundColor: '#3b7deb',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
    borderRadius: 12,
  },
  bannerIcon: {
    width: 100,
    height: 100,
  },
  btnContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  btn: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default Home;
