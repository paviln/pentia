import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

export const createUser = functions.auth.user().onCreate((user) => {
  // Unpack user data
  const userData = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    avatarUrl: user.photoURL,
  };

  // Save new user
  return admin.firestore().collection("users").add(userData);
});

// Send notification to all subscribed users
export const sendRoomNotification = functions.firestore
    .document("messages/{docId}")
    .onCreate(async (snap, context) => {
      const messageData = snap.data();
      const roomRef = messageData.roomRef;

      const roomSnap = await roomRef.get();
      const room = roomSnap.data();
      const subscribers = room.subscribers;

      let tokens: string[] = [];
      for (const subscriber of subscribers) {
        const snap = await subscriber.get();
        const user = snap.data();
        tokens = tokens.concat(user.tokens);
      }

      if (tokens.length == 0) {
        return;
      }

      const androidConfig: admin.messaging.AndroidConfig = {
        priority: "high",
      };

      const message: admin.messaging.MulticastMessage = {
        tokens: tokens,
        notification: {
          title: "New message in room",
          body: "Touch to show the message.",
        },
        data: {screen: "Room", ref: roomRef},
        android: androidConfig,
      };

      await admin.messaging().sendMulticast(message);
    });

export const removeUser = functions.auth.user().onDelete(async (user) => {
  // Find user by uid
  const snap = await admin
      .firestore()
      .collection("users")
      .where("uid", "==", user.uid)
      .get();

  // Delete user
  snap.forEach((doc) => {
    doc.ref.delete();
  });
});


