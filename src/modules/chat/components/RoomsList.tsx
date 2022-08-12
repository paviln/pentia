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
import Message from '../../../models/message';

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

  // Get a list of rooms, sorted by the newest message
  // TODO Find a better solution, as this solution uses nested for loop, on a possible big messages list
  const getRooms = async () => {
    const messageSnap = await firestore()
      .collection<Message>('messages')
      .orderBy('createdAt', 'desc')
      .get();

    const messages = messageSnap.docs;

    const querySnapshot = await firestore().collection<Room>('rooms').get();
    var roomList = querySnapshot.docs.map(r => {
      return {...r.data(), ref: r.ref};
    });

    let sortedRooms: Room[] = [];
    for (const message of messages) {
      let ref = message.data().roomRef;
      for (let i = 0; i < roomList.length; i++) {
        const room = roomList[i];
        if (ref && room.ref.id === ref.id) {
          sortedRooms.push(room);
          roomList.splice(i, 1);
          break;
        }
      }
      if (roomList.length === 0) {
        break;
      }
    }

    setRooms(sortedRooms.concat(roomList));
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
            onPress={() => navigation.navigate('Room', {id: r.ref.id})}>
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
