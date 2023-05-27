import {View, Text, FlatList, RefreshControl} from 'react-native';
import React, {useState, useEffect} from 'react';
import TabContainer from '@components/TabContainer';
import {PACKAGE_DETAILS} from '@navigation/screenNames';
import InvestPlan from '@components/InvestPlan';
import InfoText from '@components/InfoText';
import {getPackageList} from '@queries';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '@components/Loader';
import globalStyles from '@styles/globalStyles';

const Invest = ({navigation}) => {
  const [plansData, setPlansData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchPackages();
    }, []),
  );

  const fetchPackages = () => {
    setIsLoading(true);
    getPackageList()
      .then(res => {
        if (res && res?.status) {
          setPlansData(res?.data);
        }
      })
      .catch(err => console.warn(err))
      .finally(() => {
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPackages();
  }, []);

  const header = () => (
    <View>
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.header}>
          <Text style={{fontSize: 24, fontWeight: '600', color: 'white'}}>
            Profit<Text style={{fontSize: 20, fontStyle: 'italic'}}>plus</Text>
          </Text>
        </View>
      </View>
      <InfoText style={{top: -30}} />
    </View>
  );

  const renderOptions = ({item}) => (
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
        data={plansData}
        ListHeaderComponent={header}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderOptions}
      />
    </TabContainer>
  );
};

export default Invest;
