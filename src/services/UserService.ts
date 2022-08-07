import firestore from '@react-native-firebase/firestore';
import User from '../models/user';

export const get = async (uid: string) => {
  const q = firestore()
    .collection<User>('users')
    .where('uid', '==', uid)
    .limit(1);

  const snap = await q.get();
  var user = null;

  if (!snap.empty) {
    const doc = snap.docs[0];
    user = doc.data();
    user.ref = doc.ref;
  }

  return user;
};
