import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Room from '../../../models/room';
import Loading from '../../../components/Loading';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../App';

type Props = NativeStackNavigationProp<RootStackParamList, 'Room'>;

const RoomsList = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation<Props>();

  useEffect(() => {
    getRooms();
    setLoading(false);
  }, []);

  const getRooms = async () => {
    const list: Room[] = [];

    const querySnapshot = await firestore().collection<Room>('rooms').get();
    querySnapshot.forEach(r => {
      list.push({...r.data(), ref: r.ref});
    });

    setRooms(list);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    try {
      await getRooms();
      setRefreshing(false);
    } catch (error) {}
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {rooms.map((r, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={styles.container}
            onPress={() => navigation.navigate('Room', {ref: r.ref})}>
            <View style={{flexGrow: 1}}>
              <Text style={styles.title}>{r.name}</Text>
              <Text>{r.description}</Text>
            </View>
            <Icon name="chevron-right" size={20} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginTop: 3,
    backgroundColor: '#C8C8C8',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RoomsList;
