import {View, Text, StyleSheet, FlatList, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import globalStyles from '@styles/globalStyles';
import BackButton from '@components/BackButton';
import moment from 'moment';
import {transferOutHistory} from '@queries';
import {useSelector} from 'react-redux';
import Loader from '@components/Loader';

const TransferDetails = ({route, navigation}) => {
  const [details, setDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userLocalDetails = useSelector(state => state.userDetails.data);

  useEffect(() => {
    const formData = new FormData();
    formData.append('mobile', userLocalDetails?.mobile);
    formData.append('country_code', '+91');
    transferOutHistory(formData)
      .then(res => {
        if (res && res?.status && res?.data) {
          setDetails(res.data);
        }
      })
      .catch(err => console.warn(err))
      .finally(() => setIsLoading(false));
  }, []);

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

  const renderDetails = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 18, fontWeight: '500', color: '#000'}}>
          ₹{item.amount}
        </Text>
        <Text style={{fontSize: 14, color: 'grey', marginTop: 5}}>
          {item?.transfer_id}
        </Text>
      </View>
      <View style={{alignItems: "center"}}>
        <Text style={{color: '#090909'}}>
          {moment(item?.transfer_date).format('DD-MM-YYYY')}
        </Text>
        <Text
          style={{
            color: '#000',
            fontSize: 16,
            fontWeight: '500',
            marginTop: 5,
          }}>
          {'(' + item?.transfer_type + ')'}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return <Loader isTransparent={false} />;
  }

  return (
    <View style={[globalStyles.container, {backgroundColor: '#3b7deb'}]}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Transfer out details</Text>
      </View>
      <View style={styles.bottomContainer}>
        {details.length === 0 ? (
          <View style={globalStyles.center}>
            <Text style={{color: '#090909'}}>No records found!</Text>
          </View>
        ) : (
          <FlatList
            data={details}
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
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
});

export default TransferDetails;
