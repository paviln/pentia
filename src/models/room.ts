import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import User from './user';

export default interface Room {
  ref: FirebaseFirestoreTypes.DocumentReference<Room>;
  name: string;
  description: string;
  subscribers: FirebaseFirestoreTypes.DocumentReference<User>[];
}
