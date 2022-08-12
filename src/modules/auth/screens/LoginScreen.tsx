import {Alert, StyleSheet, Text} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Loading from '../../../components/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);

  //  Handle user sign in via facebook
  const onFacebookButtonPress = async () => {
    setLoading(true);

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
      await auth().signInWithCredential(facebookCredential);
    } catch (error) {
      if (error instanceof Error) {
        createDialog(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  //  Handle user sign in via google
  const onGoogleButtonPress = async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const createDialog = (message: string) => {
    return Alert.alert('Error', message, [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pentia chat</Text>
      <Icon.Button
        name="facebook"
        backgroundColor="#3b5998"
        onPress={onFacebookButtonPress}>
        Sign in with Facebook
      </Icon.Button>
      <Text style={styles.separator}>or</Text>
      <Icon.Button
        name="google"
        backgroundColor="#4285F4"
        onPress={() => onGoogleButtonPress()}>
        Sign in with Google
      </Icon.Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    padding: 30,
  },
  separator: {
    padding: 5,
    fontSize: 15,
  },
});

export default LoginScreen;
