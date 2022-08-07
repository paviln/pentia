import React, {useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './modules/chat/screens/HomeScreen';
import LoginScreen from './modules/auth/screens/LoginScreen';
import RoomScreen from './modules/chat/screens/RoomScreen';
import Room from './models/room';
import {UserContext} from './modules/auth/components/UserContext';
import User from './models/user';
import * as UserService from './services/UserService';

export type RootStackParamList = {
  Home: undefined;
  Room: {ref: FirebaseFirestoreTypes.DocumentReference<Room>};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [currentUser, setCurrentUser] =
    useState<FirebaseAuthTypes.User | null>();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
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

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <UserContext.Provider value={userData}>
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
    </UserContext.Provider>
  );
};

export default App;
