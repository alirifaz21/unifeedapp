import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Axios from 'axios';
import Thoughts from "./Thoughts";
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const API_ENDPOINT = 'http://192.168.56.1:8800/api';


function Thoughtbox({ postid, socket, postids }) {
  const [thought, setThought] = useState('');
  const [thoughts, setThoughts] = useState([]);
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();

  const handleThought = (text) => {
    setThought(text);
  };

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const response = await Axios.get(`${API_ENDPOINT}/thoughts/${postid}`);
        setThoughts(response.data);
      } catch (error) {
        console.error('Error fetching thoughts:', error);
      }
    };
    fetchThoughts();
  }, [postid]);

  const sendThought = async () => {
    const thot = {
      userid: user._id,
      postid: postid,
      text: thought,
    };

    try {
      const response = await Axios.post(`${API_ENDPOINT}/thoughts/`, thot);
      setThoughts([...thoughts, response.data]);
      setThought('');
    } catch (error) {
      console.error('Error sending thought:', error);
    }

    socket.emit('sendNotification', {
      senderid: user._id,
      receiverid: postids,
      type: 'comment',
      comments: thought,
    });
  };

  return (
    <View style={styles.thoughtboxContainer}>
      <FlatList
        data={thoughts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Thoughts thought={item} socket={socket} />}
      />
      <View style={styles.thoughtboxInput}>
        <TextInput
          style={styles.input}
          value={thought}
          onChangeText={handleThought}
          placeholder='Write your thoughts'
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendThought}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  thoughtboxContainer: {
    backgroundColor: 'white',
    padding: 25,
  },
  tboxinputdiv: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 10,

  },
  thoughtboxInput: {
    width: '100%',
    height: 25,
  },
  sendButton: {
    width: 75,
    height: '82%',
    backgroundColor: '#E7243B',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
  },
});

export default Thoughtbox;
