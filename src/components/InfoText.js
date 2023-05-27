import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {getBulletin} from '@queries';

const width = Dimensions.get('window').width;
const InfoText = ({style}) => {
  const [bulletinData, setBulletinData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBulletin()
      .then(res => {
        if (res && res?.status) {
          const newArr = [];

          for (let i = 0; i < 4; i++) {
            newArr.push(res?.data[i]);
          }
          setBulletinData(newArr);
        }
      })
      .catch(err => console.warn(err))
      .finally(() => setIsLoading(false));
  }, []);

  const renderCorousel = ({item}) => (
    <View style={styles.itemContainer}>
      {bulletinData.map((bulletin, index) => (
        <Text key={String(index)} style={styles.item}>
          {String(bulletin)}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Bulletin</Text>
      </View>
      <View
        style={{
          borderWidth: 0.3,
          borderColor: '#dbdbdb',
          marginVertical: 5,
          width: '90%'
        }}
      />
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <Carousel
          loop
          width={width - 40}
          height={100}
          style={styles.carousel}
          autoPlay={true}
          data={bulletinData}
          vertical={true}
          scrollAnimationDuration={1000}
          renderItem={renderCorousel}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    top: -30,
    backgroundColor: 'white',
    elevation: 2,
    shadowOffset: {
      width: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowColor: 'black',
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 12,
    marginHorizontal: 20,
  },
  item: {
    fontSize: 13,
    color: '#3b7deb',
    lineHeight: 20,
  },
  carousel: {
    borderRadius: 12,
  },
  loaderContainer: {
    paddingVertical: 30,
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

export default InfoText;
