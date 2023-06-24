import {JSHash, JSHmac, CONSTANTS} from 'react-native-hash';

export function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export function convertHash(arr) {
  let finalString = '';
  for (let i = 0; i < arr.length; i++) {
    finalString += arr[i];
  }
  JSHash(finalString, CONSTANTS.HashAlgorithms.sha256)
    .then(hash => {
      console.log(hash);
    })
    .catch(err => {
      console.warn(err);
    });
}
