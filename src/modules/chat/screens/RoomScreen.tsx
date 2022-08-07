import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {TextInput, StyleSheet, SafeAreaView, View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {RootStackParamList} from '../../../App';
import MessageList from '../components/MessageList';
import Message from '../../../models/message';
import MessageUserDto from '../dtos/messageUserDto';
import {useUserContext} from '../../auth/components/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Room'>;

const RoomScreen = (props: Props) => {
  const [messages, setMessages] = useState<MessageUserDto[]>([]);
  const [text, setText] = useState('');
  const userData = useUserContext();
  const roomRef = props.route.params.ref;

  useEffect(() => {
    const getData = async () => {
      const unsubscribe = firestore()
        .collection<Message>('messages')
        .where('roomRef', '==', roomRef)
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
  }, [roomRef]);

  const sendMessage = () => {
    const message: Message = {
      text: text,
      createdAt:
        firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      roomRef: props.route.params.ref,
      userRef: userData?.ref ?? null,
    };

    firestore().collection('messages').add(message);
  };

  const handleMessageSubmit = () => {
    if (text !== '') {
      sendMessage();
      setText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <MessageList messages={messages} />
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter message"
          value={text}
          onChangeText={t => setText(t)}
          onSubmitEditing={handleMessageSubmit}
        />
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
    paddingTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default RoomScreen;
