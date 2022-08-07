import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MessageUserDto from '../dtos/messageUserDto';

type Props = {
  messageUser: MessageUserDto;
};

const MessageItem = ({messageUser}: Props) => {
  return (
    <View>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: 'https://lh3.googleusercontent.com/a-/AFdZucqpANePNcvZjSIrZSzWQcCsazHStdV9lQUy6SihDw=s96-c',
          }}
        />
        <View style={styles.body}>
          <Text>{messageUser.user?.name}</Text>
          <Text>{messageUser.message.text}</Text>
        </View>
      </View>
      <Text style={{alignSelf: 'flex-end'}}>
        {messageUser.message.createdAt?.toDate().toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  body: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#b0b0b0',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 67,
    height: 59,
    paddingRight: 5,
  },
});

export default MessageItem;
