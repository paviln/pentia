import {ScrollView, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import MessageItem from './MessageItem';
import MessageUserDto from '../dtos/messageUserDto';

type Props = {
  messages: MessageUserDto[];
};

const MessageList = (props: Props) => {
  const scrollViewRef = useRef<ScrollView | null>(null);

  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef}
      onContentSizeChange={() => {
        scrollViewRef?.current?.scrollToEnd({animated: false});
      }}>
      {props.messages.map((m, index) => {
        return <MessageItem key={index} messageUser={m} />;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 2,
  },
});

export default MessageList;
