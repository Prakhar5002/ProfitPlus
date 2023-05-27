import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Share,
  Linking,
} from 'react-native';
import React from 'react';
import TabContainer from '@components/TabContainer';
import {setSmallFont} from '@utils/setStyle';
import FilledButton from '@components/FilledButton';
import Link from '@components/Link';
import {useSelector} from 'react-redux';
import globalStyles from '@styles/globalStyles';
import images from '@assets/images';
import {SHARE_TYPE} from '@constants';

const Rewards = ({navigation}) => {
  const userLocalDetails = useSelector(state => state.userDetails.data);
  const bottomOptions = [
    {
      source: images.fb_icon,
      type: SHARE_TYPE.WHATSAPP,
    },
    {
      source: images.whatsapp_icon,
      type: SHARE_TYPE.WHATSAPP,
    },
    {
      source: images.insta_icon,
      type: SHARE_TYPE.WHATSAPP,
    },
    {
      source: images.telegram_icon,
      type: SHARE_TYPE.TELEGRAM,
    },
  ];

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

  return (
    <TabContainer>
      <View style={styles.headerContainer}>
        <View style={{paddingHorizontal: 20, marginVertical: 15}}>
          <Text style={{fontSize: 24, fontWeight: '600', color: 'white'}}>
            ₹0.00
          </Text>
          <Text style={{fontSize: 16, color: '#dbdbdb'}}>
            Total commission earned
          </Text>
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
      {/* <View style={styles.bottomCard}>
        {bottomOptions.map((item, index) => (
          <Pressable key={String(index)} onPress={() => onShare(item.type)}>
            <Image source={item.source} style={styles.icon} />
          </Pressable>
        ))}
      </View> */}
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
});

export default Rewards;
