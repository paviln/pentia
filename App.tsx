import React, {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import SplashScreen from 'react-native-splash-screen';
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import config from './config';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import FacebookSigninButton from './src/modules/auth/components/FacebookSigninButton';

const PROFILE_IMAGE_SIZE = 150;

const App = () => {
  // Initializing state whilst app loads
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] =
    useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    // Handle user state changes
    const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
      setCurrentUser(user);
      if (initializing) {
        setInitializing(false);
        SplashScreen.hide();
      }
    };

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, [initializing]);

  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: config.webClientId,
      offlineAccess: false,
      profileImageSize: PROFILE_IMAGE_SIZE,
    });
  };

  //  Handle user sign in via facebook
  const onFacebookButtonPress = async () => {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw new Error('Login with Facebook was cancelled');
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      auth().signInWithCredential(facebookCredential);
    } catch (error) {
      if (error instanceof Error) {
        createDialog(error.message);
      }
    }
  };

  //  Handle user sign in via google
  const onGoogleButtonPress = async () => {
    try {
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error instanceof Error) {
        createDialog(error.message);
      }
    }
  };

  const createDialog = (message: string) =>
    Alert.alert('Error', message, [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  if (initializing) {
    return null;
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <FacebookSigninButton onPress={() => onFacebookButtonPress()} />
        <GoogleSigninButton
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <View>
      <Text>Welcome {currentUser.email}</Text>
      <Button
        title="Sign out"
        onPress={() =>
          auth()
            .signOut()
            .then(() => console.log('User signed out!'))
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default App;
