import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  onPress?(): void;
};

const FacebookSigninButton = (props: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Icon name="facebook" size={20} color="#fff" />
      <Text style={styles.text}>Login With Facebook</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
    flexDirection: 'row',
    backgroundColor: '#3578E5',
  },
  text: {
    marginLeft: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FacebookSigninButton;
