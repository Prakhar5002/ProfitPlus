import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Share,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TabContainer from '@components/TabContainer';
import {setSmallFont} from '@utils/setStyle';
import {useSelector} from 'react-redux';
import globalStyles from '@styles/globalStyles';
import images from '@assets/images';
import {SHARE_TYPE} from '@constants';
import {transferableReward} from '@queries';
import {TRANSFERABLE_AMOUNT} from '@navigation/screenNames';
import Clipboard from '@react-native-clipboard/clipboard';
import CustomSnackbar from '@components/CustomSnackbar';
import Loader from '@components/Loader';
import NoConnection from '@components/NoConnection';

const Rewards = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const userLocalDetails = useSelector(state => state.userDetails.data);

  useEffect(() => {
    fetchTransferableReward();
  }, []);

  const fetchTransferableReward = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    transferableReward(formData)
      .then(res => {
        if (res && res?.status) {
          setData(res?.data);
        }
      })
      .catch(err => {
        console.warn(err);
        setIsConnected(false);
      })
      .finally(() => setLoading(false));
  };

  const shareGeneral = async () => {
    try {
      const result = await Share.share({
        message: `If your friends have invested in the platform, you can get 10% of the total investment amount\n\nhttp://profitpluszone.com/download?ref=${userLocalDetails.referalCode}\n\nREFERRAL CODE: ${userLocalDetails.referalCode}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.warn(error.message);
    }
  };

  const onShare = async type => {
    switch (type) {
      case SHARE_TYPE.WHATSAPP:
        return Linking.openURL('whatsapp://send?text=' + '');

      case SHARE_TYPE.TELEGRAM:
        return Linking.openURL('https://t.me/PR0FITPLUS');
      default:
        shareGeneral();
    }
  };

  const copyToClipboard = () => {
    if (userLocalDetails?.referalCode) {
      Clipboard.setString(userLocalDetails?.referalCode);
      CustomSnackbar('Code copied successfully', 1);
    }
  };

  if (loading) {
    return <Loader isTransparent={false} />;
  }

  if (!isConnected) {
    return <NoConnection onPress={fetchTransferableReward} />;
  }

  return (
    <TabContainer>
      <View style={styles.headerContainer}>
        <View style={{paddingHorizontal: 20, marginVertical: 15}}>
          <Text style={{fontSize: 24, fontWeight: '600', color: 'white'}}>
            ₹{data?.totalcommission}
          </Text>
          <Text style={{fontSize: 16, color: '#dbdbdb'}}>Total commission</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 20,
            borderRadius: 12,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 24, fontWeight: '600', color: '#000'}}>
              ₹{data?.totalcommission}
            </Text>
            <Text style={{marginTop: 3, color: '#090909'}}>
              Transferable commission
            </Text>
          </View>

          <View>
            <Pressable
              style={styles.cardBtnContainer}
              onPress={() => navigation.navigate(TRANSFERABLE_AMOUNT)}>
              <Image
                style={[globalStyles.icon, {tintColor: 'white'}]}
                source={images.right_arrow}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.headerCard}>
          <Text style={setSmallFont(18, '700')}>Invite a friend</Text>
          <Text
            style={{
              fontSize: 14,
              color: 'grey',
              fontWeight: '500',
              marginTop: 5,
              lineHeight: 20,
            }}>
            If your friends have invested in the platform, you can get 10% of
            the total investment amount
          </Text>
          <View style={{marginTop: 30, alignItems: 'center'}}>
            <Pressable style={styles.cardBtnContainer} onPress={onShare}>
              <Image
                style={[globalStyles.icon, {tintColor: 'white'}]}
                source={images.share_icon}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: 'white',
                  marginLeft: 10,
                }}>
                Share
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.headerCard}>
        <Text style={setSmallFont(18, '700')}>My referral code</Text>
        <Pressable style={styles.referralContainer} onPress={copyToClipboard}>
          <Text style={styles.referralText}>
            {userLocalDetails?.referalCode}
          </Text>
          <Image
            style={{width: 25, height: 25}}
            source={images.copy_icon}
            tintColor="white"
          />
        </Pressable>
      </View>
    </TabContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#3b7deb',
  },
  headerCard: {
    width: '90%',
    backgroundColor: 'white',
    paddingVertical: 20,
    alignSelf: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    elevation: 2,
    marginVertical: 20,
  },
  cardBtnContainer: {
    backgroundColor: '#3b7deb',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bottomCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    elevation: 4,
  },
  icon: {
    width: 40,
    height: 40,
  },
  referralContainer: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'grey',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  referralText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default Rewards;
