import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export default interface Room {
  ref: FirebaseFirestoreTypes.DocumentReference<Room>;
  name: string;
  description: string;
}
