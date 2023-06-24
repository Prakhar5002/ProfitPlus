import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import TabContainer from '@components/TabContainer';
import {setMediumFont} from '@utils/setStyle';
import {
  TRANSFERABLE_AMOUNT,
  PACKAGE_DETAILS,
  MY_PLAN,
} from '@navigation/screenNames';
import InvestPlan from '@components/InvestPlan';
import images from '@assets/images';
import globalStyles from '@styles/globalStyles';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getUserPortfolio} from '@queries';
import Loader from '@components/Loader';
import NoConnection from '@components/NoConnection';

const Portfolio = ({navigation}) => {
  const [myPackageDetails, setMyPackageDetails] = useState([]);
  const [portfolioDetails, setPortfolioDetails] = useState({
    totalInvested: 0,
    todayEarning: 0,
    totalEarning: 0,
    transferableAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const userDetails = useSelector(state => state.userDetails.data);

  useFocusEffect(
    React.useCallback(() => {
      fetchPortfolioDetails();
    }, []),
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPortfolioDetails();
  }, []);

  const fetchPortfolioDetails = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('mobile', userDetails?.mobile);
    formData.append('country_code', '+91');
    getUserPortfolio(formData)
      .then(res => {
        if (res && res?.status) {
          setPortfolioDetails({
            ...portfolioDetails,
            totalInvested: res.total_invest,
            todayEarning: res.today_income,
            totalEarning: res.total_income,
            transferableAmount: res.transferable_amount,
          });
          setMyPackageDetails(res.data);
        }
      })
      .catch(err => {
        console.warn(err);
        setIsConnected(false);
      })
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  if (!isConnected) {
    return <NoConnection onPress={onRefresh} />;
  }

  if (isLoading) {
    return <Loader isTransparent={false} />;
  }

  const renderHeader = () => (
    <View>
      <View style={globalStyles.headerContainer}>
        <View
          style={{flex: 1, justifyContent: 'center', paddingHorizontal: 10}}>
          <Text style={{fontSize: 24, fontWeight: '600', color: 'white'}}>
            My Portfolio
          </Text>
        </View>
      </View>
      <View style={globalStyles.headerCard}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <View style={{flex: 1}}>
            <Text style={setMediumFont(24, '700')}>
              ₹{portfolioDetails.totalInvested}
            </Text>
            <Text style={setMediumFont(18, '600')}>Total Invested</Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 0.3,
            borderColor: '#dbdbdb',
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <View style={{flex: 1}}>
            <Text style={setMediumFont(18, '600')}>
              ₹{portfolioDetails.todayEarning}
            </Text>
            <Text style={[setMediumFont(16, '600'), {color: 'grey'}]}>
              Today's earning
            </Text>
          </View>
          <View>
            <Text style={[setMediumFont(18, '600'), {textAlign: 'right'}]}>
              ₹{portfolioDetails.totalEarning}
            </Text>
            <Text style={[setMediumFont(16, '600'), {color: 'grey'}]}>
              Total earning
            </Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 0.3,
            borderColor: '#dbdbdb',
            marginTop: 15,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <View style={{flex: 1}}>
            <Text style={setMediumFont(18, '600')}>
              ₹{portfolioDetails.transferableAmount}
            </Text>
            <Text style={[setMediumFont(16, '600'), {color: 'grey'}]}>
              Transferable amount
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
      </View>
      {myPackageDetails.length > 0 && (
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#000',
            marginHorizontal: 20,
            marginBottom: 10,
          }}>
          My Plans
        </Text>
      )}
    </View>
  );

  const renderPlans = ({item}) => (
    <InvestPlan
      item={item}
      isPurchaseVisible={false}
      onPress={packageData =>
        navigation.navigate(MY_PLAN, {
          data: packageData,
        })
      }
    />
  );
  return (
    <TabContainer>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderHeader}
        data={myPackageDetails}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderPlans}
      />
    </TabContainer>
  );
};

const styles = StyleSheet.create({
  cardBtnContainer: {
    backgroundColor: '#3b7deb',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
    borderRadius: 12,
  },
});

export default Portfolio;
