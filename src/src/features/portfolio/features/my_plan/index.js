import {View, Text, StyleSheet, FlatList, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import globalStyles from '@styles/globalStyles';
import BackButton from '@components/BackButton';
import {capitalize} from '@utils';
import moment from 'moment';

const MyPlan = ({route, navigation}) => {
  const {data} = route?.params;

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

  function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum;
  }

  const renderDetails = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={{fontSize: 18, fontWeight: '500', color: '#000', flex: 1}}>
        ₹{item.profit_income}
      </Text>
      <Text style={{color: '#090909'}}>
        {/* {moment(item.date).format('MMM Do YY')} */}
        {String(item.date)}
        {/* {moment(Date.parse(item.date)).format('MMM Do YY')} */}
      </Text>
    </View>
  );

  return (
    <View style={[globalStyles.container, {backgroundColor: '#3b7deb'}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{capitalize(data.name)}</Text>
      </View>
      <View style={styles.bottomContainer}>
        {data?.profit_details.length === 0 ? (
          <View style={globalStyles.center}>
            <Text style={{color: '#090909'}}>No records found!</Text>
          </View>
        ) : (
          <FlatList
            data={data?.profit_details}
            keyExtractor={(item, index) => String(index)}
            renderItem={renderDetails}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: 'white',
    height: 150,
  },
  header: {
    alignItems: 'center',
    margin: 10,
    marginVertical: 15,
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 6,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
});

export default MyPlan;
