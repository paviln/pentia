import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text} from 'react-native';
import {RootStackParamList} from '../../../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Room'>;

const RoomScreen = (props: Props) => {
  if (!props.route.params?.id) {
    props.navigation.goBack();
  }
  return (
    <View>
      <Text>{props.route.params?.id}</Text>
    </View>
  );
};

export default RoomScreen;
