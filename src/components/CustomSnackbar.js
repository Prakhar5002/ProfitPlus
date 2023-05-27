import Snackbar from 'react-native-snackbar';

export default function CustomSnackbar(msg, type = 0) {
  Snackbar.show({
    text: msg,
    duration: Snackbar.LENGTH_LONG,
    numberOfLines: 7,
    backgroundColor: type === 0 ? 'red' : 'green',
    textColor: 'white',
  });
}
