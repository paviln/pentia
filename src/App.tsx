import React, {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef, navigate} from './RootNavigation';
import HomeScreen from './modules/chat/screens/HomeScreen';
import LoginScreen from './modules/auth/screens/LoginScreen';
import RoomScreen from './modules/chat/screens/RoomScreen';
import Room from './models/room';
import {UserContext} from './modules/auth/components/UserContext';
import User from './models/user';
import * as UserService from './services/UserService';

export type RootStackParamList = {
  Home: undefined;
  Room: {id: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] =
    useState<FirebaseAuthTypes.User | null>();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Navigate the user to the room the message notification came from
    const navigateToScreen = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      const data = remoteMessage.data;
      const screen = data?.screen;
      const ref: FirebaseFirestoreTypes.DocumentReference<Room> = JSON.parse(
        data!.ref,
      );
      if (screen === 'Room') {
        navigate(screen, {ref: ref});
      }
    };

    messaging().onNotificationOpenedApp(remoteMessage =>
      navigateToScreen(remoteMessage),
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const data = remoteMessage.data;
          const screen = data?.screen;
          const ref: FirebaseFirestoreTypes.DocumentReference<Room> =
            JSON.parse(data!.ref);
          if (screen) {
            navigate(screen, {ref: ref});
          }
        }
        setLoading(false);
      });

    // Handle user state changes
    const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
      if (user) {
        const data = await UserService.get(user.uid);
        setUserData(data);
      }

      setCurrentUser(user);
    };

    auth().onAuthStateChanged(onAuthStateChanged);

    // Remove splash
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    // Add the token to the user
    async function saveTokenToDatabase() {
      const token = await messaging().getToken();

      await userData?.ref.update({
        tokens: firestore.FieldValue.arrayUnion(token),
      });

      // Listen to token changes
      return messaging().onTokenRefresh(saveTokenToDatabase);
    }

    saveTokenToDatabase();
  }, [userData]);

  if (loading) {
    return null;
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <UserContext.Provider value={userData}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Room"
            component={RoomScreen}
            options={{title: 'Room'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
};

export default App;
