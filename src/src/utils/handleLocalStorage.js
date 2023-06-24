import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setStorageString(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.warn('Error while storing data ', e);
  }
}

export async function getStorageString(key) {
  let response = null;
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      response = value;
    }
  } catch (e) {
    console.warn('Error while getting data ', e);
  }
  return response;
}

export async function setStorageObject(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.warn('Error while storing data ', e);
  }
}

export async function getStorageObject(key) {
  let response = null;
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      response = JSON.parse(jsonValue);
    }
  } catch (e) {
    console.warn('Error while getting data ', e);
  }
  return response;
}
