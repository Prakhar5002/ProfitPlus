import {StyleSheet, Dimensions} from 'react-native';
import colors from './colors';

const windowHeight = Dimensions.get('window').height;
const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBold: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
  textSemiBold: {
    fontSize: 25,
    fontWeight: '600',
    color: colors.WHITE,
  },
  text_sm: {
    fontSize: 14,
    color: colors.WHITE,
    lineHeight: 25,
  },
  centerText: {
    textAlign: 'center',
  },
  text_md: {
    fontSize: 16,
    color: colors.WHITE,
    lineHeight: 30,
  },
  text_lg: {
    fontSize: 18,
    color: colors.WHITE,
    lineHeight: 30,
  },
  image_general: {
    width: 80,
    height: 80,
  },
  walkingImage: {
    width: 80,
    height: 120,
  },
  logo: {
    width: 150,
    height: 150,
  },
  icon: {
    width: 22,
    height: 22,
  },
  profit: {
    width: 100,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  loss: {
    width: 100,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#3b7deb',
    height: 120,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  headerCard: {
    width: '90%',
    top: -30,
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
});

export default globalStyles;
