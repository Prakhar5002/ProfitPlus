import {View, Image, StyleSheet, TextInput} from 'react-native';
import React from 'react';
import globalStyles from '@styles/globalStyles';

const BorderInput = ({
  placeholder,
  style,
  source,
  secureTextEntry = false,
  keyboardType = 'default',
  onChangeText,
  maxLength,
  value,
}) => {
  return (
    <View style={[styles.container, style]}>
      {source && (
        <Image style={[globalStyles.icon, styles.icon]} source={source} />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        placeholderTextColor="rgb(142, 142, 142)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={val => onChangeText(val)}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 12,
    padding: 10,
    color: '#000',
  },
  icon: {
    tintColor: 'rgb(98, 100, 102)',
  },
});

export default BorderInput;
