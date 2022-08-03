import React, {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import SplashScreen from 'react-native-splash-screen';
import config from './config';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/modules/chat/screens/HomeScreen';
import LoginScreen from './src/modules/auth/screens/LoginScreen';
import RoomScreen from './src/modules/chat/screens/RoomScreen';

export type RootStackParamList = {
  Home: undefined;
  Room: {id: string} | undefined;
};

const PROFILE_IMAGE_SIZE = 150;
const Stack = createNativeStackNavigator<RootStackParamList>();

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

  if (initializing) {
    return null;
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Room"
          component={RoomScreen}
          options={{title: 'Room'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
