import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export default interface User {
  uid: string;
  ref: FirebaseFirestoreTypes.DocumentReference<User>;
  email: string;
  name: string;
  avatarUrl: string;
}
