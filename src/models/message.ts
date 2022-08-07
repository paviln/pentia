import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Room from './room';
import User from './user';

export default interface Message {
  ref?: FirebaseFirestoreTypes.DocumentReference<Message>;
  text: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  roomRef: FirebaseFirestoreTypes.DocumentReference<Room>;
  userRef?: FirebaseFirestoreTypes.DocumentReference<User> | null;
}
