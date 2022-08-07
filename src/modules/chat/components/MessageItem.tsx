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
            uri: messageUser.user?.avatarUrl,
          }}
        />
        <View style={styles.body}>
          <Text>{messageUser.user?.name}</Text>
          {messageUser.message.text !== '' && (
            <Text>{messageUser.message.text}</Text>
          )}
          {messageUser.message.imageUrl && (
            <Image
              style={styles.imageContent}
              source={{
                uri: messageUser.message.imageUrl,
              }}
            />
          )}
        </View>
      </View>
      <Text style={styles.footer}>
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
  imageContent: {
    width: undefined,
    height: 150,
    marginTop: 5,
  },
  footer: {
    alignSelf: 'flex-end',
  },
});

export default MessageItem;
