import {View, Dimensions, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import corousel from '@assets/data/corousel';
import images from '@assets/images';

const width = Dimensions.get('window').width;
const Banner = ({style}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({item}) => (
    <View style={styles.carouselItem}>
      <Image style={styles.carouselImage} source={images.corousel2} />
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <Carousel
        loop
        width={width - 40}
        height={width / 2}
        autoPlay={true}
        style={styles.carousel}
        data={corousel}
        scrollAnimationDuration={1000}
        onSnapToItem={index => setCurrentIndex(index)}
        renderItem={renderItem}
      />
      <View style={styles.dotsContainer}>
        {corousel.map((item, index) => (
          <View
            key={String(index)}
            style={[
              styles.dot,
              {backgroundColor: index === currentIndex ? 'white' : 'green'},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 12,
    marginVertical: 10,
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  carousel: {
    borderRadius: 12,
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 12,
  },
  carouselImage: {
    flex: 1,
    borderRadius: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dot: {
    width: 30,
    height: 4,
  },
});

export default Banner;
