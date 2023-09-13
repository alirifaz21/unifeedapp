import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'; // Use navigation for screen transitions
import Axios from 'axios';
import ThoughtsReply from "./Thoughtsreply";
const API_ENDPOINT = 'http://192.168.56.1:8800/api';


function ThoughtsReplybox({ thoughtid, socket, thoughtuserid }) {
    const [reply, setReply] = useState([]);
    const [thoughtReply, setThoughtReply] = useState('');
    const user = useSelector((state) => state.user.user);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchReply = async () => {
            try {
                const response = await Axios.get(`${API_ENDPOINT}/thoughts/reply/${thoughtid}`);
                setReply(response.data);
            } catch (error) {
                console.error('Error fetching replies:', error);
            }
        };
        fetchReply();
    }, [thoughtid]);

    const handleThoughtReply = (text) => {
        setThoughtReply(text);
    };

    const sendThought = async () => {
        const thought = {
            thoughtid: thoughtid,
            userid: user._id,
            text: thoughtReply,
        };

        try {
            const response = await Axios.post(`${API_ENDPOINT}/thoughts/reply`, thought);
            setReply([...reply, response.data]);
            setThoughtReply('');
        } catch (error) {
            console.error('Error sending thought reply:', error);
        }

        socket.emit('sendNotification', {
            senderid: user._id,
            receiverid: thoughtuserid,
            type: 'thoughtReply',
            comments: thoughtReply,
        });
    };

    return (
        <View style={styles.thoughtReplyboxContainer}>
            <FlatList
                data={reply}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ThoughtsReply reply={item} socket={socket} />
                )}
            />
            <View style={styles.thoughtReplyInput}>
                <TextInput
                    style={styles.input}
                    value={thoughtReply}
                    onChangeText={handleThoughtReply}
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
    sendButton: {
        width: 75,
        height: 20,
        backgroundColor: '#E7243B',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText:{
        color:"white"
    }
});


export default ThoughtsReplybox;
