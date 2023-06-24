import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  BackHandler,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import globalStyles from '@styles/globalStyles';
import FilledButton from '@components/FilledButton';
import images from '@assets/images';
import BackButton from '@components/BackButton';
import {capitalize} from '@utils';
import CustomSlider from './CustomSlider';
import APP_TEXT from '@assets/locale/en';
import {purchasePackage, getUserDetails} from '@queries';
import {useSelector, useDispatch} from 'react-redux';
import {userDetails} from '@redux/actions';
import {JSHash, CONSTANTS} from 'react-native-hash';
import CustomSnackbar from './CustomSnackbar';
import Loader from './Loader';

const PackageDetails = ({navigation, route}) => {
  const {
    amount,
    cycle_days,
    daily_income,
    name,
    per_user,
    id,
    description,
    image,
  } = route?.params?.data ?? null;
  const packageImage = route?.params?.data?.image;
  const userLocalDetails = useSelector(state => state.userDetails.data);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const purchasePlan = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('package', id);
    formData.append('amount', amount);
    JSHash(
      id + amount + userLocalDetails?.mobile,
      CONSTANTS.HashAlgorithms.sha256,
    )
      .then(hashRes => {
        formData.append('authchecksum', hashRes);
      })
      .catch(err => console.warn(err))
      .finally(() => {
        purchasePackage(formData)
          .then(res => {
            if (res && res?.status) {
              CustomSnackbar('Plan purchased succesfully', 1);
            } else {
              CustomSnackbar(String(Object.values(res?.message)));
            }
          })
          .catch(err => {
            console.warn(err);
            CustomSnackbar(APP_TEXT.error_text);
          })
          .finally(() => fetchUserDetails());
      });
  };

  const fetchUserDetails = () => {
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    getUserDetails(formData)
      .then(res => {
        if (res && res?.status) {
          dispatch(
            userDetails({
              ...userLocalDetails,
              walletAmount: res.wallet_amount,
            }),
          );
        }
      })
      .catch(err => console.warn(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={globalStyles.headerText}>Package details</Text>
        </View>
      </View>
      <View style={styles.headerCard}>
        <ImageBackground
          style={styles.imageBackground}
          resizeMode="contain"
          defaultSource={images.profitplus_icon}
          imageStyle={{borderTopLeftRadius: 12, borderTopRightRadius: 12}}
          source={{uri: packageImage}}>
          <View style={{flex: 1}} />
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{capitalize(name)}</Text>
          </View>
        </ImageBackground>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{color: '#090909', fontSize: 12}}>
              Purchase amount
            </Text>
            <Text style={styles.infoText}>₹{amount}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{color: '#090909', fontSize: 12}}>Daily income</Text>
            <Text style={styles.infoText}>{daily_income}%</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{color: '#090909', fontSize: 12}}>Cycle</Text>
            <Text style={styles.infoText}>{cycle_days} days</Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 0.3,
            borderColor: '#dbdbdb',
            marginVertical: 15,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <Text style={{color: '#000', fontSize: 16}}>Total bought:</Text>
          <CustomSlider value={60} style={{marginHorizontal: 10}} />
          <Text style={{color: 'grey', fontSize: 16}}>60%</Text>
        </View>
        <FilledButton
          title="Buy it"
          style={{alignSelf: 'center', marginTop: 20}}
          onPress={purchasePlan}
        />
      </View>

      <View
        style={[
          styles.headerCard,
          {
            paddingHorizontal: 10,
            paddingVertical: 20,
            marginTop: 20,
          },
        ]}>
        <Text style={{color: '#000', fontSize: 20, fontWeight: '500'}}>
          Details
        </Text>
        <Text style={{color: '#090909', marginTop: 10, lineHeight: 20}}>
          {description}
        </Text>
      </View>
      {isLoading && <Loader />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5fe',
  },
  imageBackground: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 10,
  },
  headerCard: {
    paddingBottom: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    backgroundColor: 'white',
    top: -30,
    elevation: 2,
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowColor: 'black',
  },
  cardTitleContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  cardTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: '500',
  },
  infoText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
});

export default PackageDetails;
