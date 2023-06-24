import {View, Image, StyleSheet, TextInput} from 'react-native';
import React from 'react';
import globalStyles from '@styles/globalStyles';

const InputText = ({
  placeholder,
  style,
  source,
  secureTextEntry = false,
  keyboardType = 'default',
  onChangeText,
  maxLength,
}) => {
  return (
    <View style={[styles.container, style]}>
      {source && (
        <Image style={[globalStyles.icon, styles.icon]} source={source} />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(142, 142, 142)',
    padding: 10,
    marginLeft: 10,
    color: '#000',
  },
  icon: {
    tintColor: 'rgb(98, 100, 102)',
  },
});

export default InputText;
