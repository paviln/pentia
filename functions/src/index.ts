import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

// Init data
const data = [
  {
    name: "General",
    description: "General",
  },
  {
    name: "Work",
    description: "Work",
  },
  {
    name: "Announcements",
    description: "Announcements",
  },
];
const batch = admin.firestore().batch();
data.forEach((doc) => {
  const docRef = admin.firestore().collection("rooms").doc();
  batch.set(docRef, doc);
});
batch.commit();

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
