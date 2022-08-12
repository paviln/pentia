import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  TextInput,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  Button,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import {RootStackParamList} from '../../../App';
import MessageList from '../components/MessageList';
import Message from '../../../models/message';
import MessageUserDto from '../dtos/messageUserDto';
import {useUserContext} from '../../auth/components/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Room from '../../../models/room';
import {useNavigation} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Room'>;

const RoomScreen = (props: Props) => {
  const userData = useUserContext();
  const roomId = props.route.params.id;
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState<MessageUserDto[]>([]);
  const [text, setText] = useState('');
  const [room, setRoom] = useState<Room>();
  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      try {
        const ref = firestore().collection<Room>('rooms').doc(roomId);
        const doc = await ref.get();
        const data = doc.data();
        if (data === undefined) {
          throw Error('Room does not exist.');
        }
        let roomData: Room = {...data, ref: doc.ref};
        setRoom(roomData);
      } catch (error) {
        navigation.goBack();
      }
    };

    getData();
  }, [navigation, roomId]);

  useEffect(() => {
    if (room === undefined) {
      return;
    }
    const getData = async () => {
      const unsubscribe = firestore()
        .collection<Message>('messages')
        .where('roomRef', '==', room.ref)
        .orderBy('createdAt', 'asc')
        .onSnapshot(async querySnapshot => {
          var list: MessageUserDto[] = [];
          for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const user = await (await doc.data().userRef?.get())?.data();
            list.push({message: data, user: user});
          }
          setMessages(list);
        });

      return () => unsubscribe();
    };

    getData();
  }, [room]);

  const sendMessage = async (imageUrl: string) => {
    const message: Message = {
      text: text,
      imageUrl: imageUrl,
      createdAt:
        firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      roomRef: room!.ref,
      userRef: userData?.ref ?? null,
    };

    try {
      await firestore().collection('messages').add(message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageSubmit = async () => {
    if (text !== '') {
      await sendMessage('');

      // Check if user allready was asked to subscribe
      if (!room?.subscribers.some(s => s.id === userData?.ref.id)) {
        createSubscribeAlert();
      }
      setText('');
    }
  };

  const handleCamaraUpload = async () => {
    const options: CameraOptions = {
      cameraType: 'front',
      mediaType: 'photo',
    };
    const result = await launchCamera(options);

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      uploadImage(asset);
    }
  };

  const handleLibraryUpload = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    const result = await launchImageLibrary(options);

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      uploadImage(asset);
    }
  };

  const uploadImage = async (asset: Asset) => {
    if (asset.uri) {
      const reference = storage().ref('images/' + uuid.v4().toString());
      await reference.putFile(asset.uri);
      const url = await reference.getDownloadURL();
      await sendMessage(url);
    }
    setModalVisible(false);
  };

  const subscribeToRoom = () => {
    try {
      room!.ref.update({
        subscribers: firestore.FieldValue.arrayUnion(userData!.ref),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createSubscribeAlert = () =>
    Alert.alert(
      'Notifications',
      'Do you want to have notifications from this room?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => subscribeToRoom()},
      ],
    );

  if (room === undefined) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modelTitle}>Upload image from</Text>
            <Button title="Camara" onPress={() => handleCamaraUpload()} />
            <Text style={styles.modelSeperator}>or</Text>
            <Button
              title="Image Library"
              onPress={() => handleLibraryUpload()}
            />
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>Messages</Text>
      <MessageList messages={messages} />
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter message"
          value={text}
          onChangeText={t => setText(t)}
          onSubmitEditing={() => handleMessageSubmit()}
        />
        <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
          <Icon name="camera" size={35} />
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 20,
    paddingLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modelTitle: {
    fontSize: 20,
    paddingBottom: 10,
  },
  modelSeperator: {
    textAlign: 'center',
    paddingVertical: 5,
    fontSize: 16,
  },
});

export default RoomScreen;
