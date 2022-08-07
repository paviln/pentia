import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import config from './config';

// Firebase config
if (__DEV__) {
  auth().useEmulator('http://localhost:9099');
  functions().useEmulator('localhost', 5001);
  firestore().useEmulator('localhost', 8080);
  storage().useEmulator('localhost', 9199);
}

const settings = {
  persistence: false,
};

firebase.firestore().settings(settings);

// Google auth
const PROFILE_IMAGE_SIZE = 150;

GoogleSignin.configure({
  webClientId: config.webClientId,
  offlineAccess: false,
  profileImageSize: PROFILE_IMAGE_SIZE,
});

AppRegistry.registerComponent(appName, () => App);
