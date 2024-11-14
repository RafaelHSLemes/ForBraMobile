// ChatScreen.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E90FF', // Azul
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#32CD32', // Verde
  },
  messageText: {
    color: '#FFFFFF',
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#1E90FF', // Azul
  },
});

export default styles;