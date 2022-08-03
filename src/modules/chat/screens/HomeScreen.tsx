import React from 'react';
import auth from '@react-native-firebase/auth';
import {Button, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RoomsList from '../components/RoomsList';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Rooms</Text>
      <RoomsList />
      <View style={styles.footer}>
        <Button
          title="Sign out"
          onPress={() =>
            auth()
              .signOut()
              .then(() => console.log('User signed out!'))
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    padding: 10,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default HomeScreen;
