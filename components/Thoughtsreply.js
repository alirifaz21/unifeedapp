import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // You can replace this with your preferred icon library.

const API_ENDPOINT = 'http://192.168.56.1:8800/api';

const ThoughtsReply = ({ reply, socket, navigateToUserProfile }) => {
    const PF = "https://unifeed.s3.ap-south-1.amazonaws.com/";

    const [user, setUser] = useState({});
    const [like, setLike] = useState(reply.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [dislike, setDislike] = useState(reply.dislikes.length);
    const [isDisliked, setIsDisliked] = useState(false);

    useEffect(() => {
        // Implement fetching user data using Axios here
        const fetchUser = async () => {
            try {
                const response = await Axios.get(`${API_ENDPOINT}/users/friend/${reply.userid}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, []);

    const likeHandler = async () => {
        const updatedLikeCount = isLiked ? like - 1 : like + 1;
        setLike(updatedLikeCount);
        setIsLiked(!isLiked);

        if (isDisliked) {
            setDislike(dislike - 1);
            setIsDisliked(false);
        }

        try {
            const response = await axios.put(`${API_ENDPOINT}/thoughts/reply/${reply._id}/like`, {
                userId: currentuser._id,
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error liking the reply:', error);
            // Handle error
        }

        if (!isLiked) {
            socket.emit('sendNotification', {
                senderid: currentuser._id,
                receiverid: reply.userid,
                type: 'replyAgree',
            });
        }
    };

    const dislikeHandler = async () => {
        const updatedDislikeCount = isDisliked ? dislike - 1 : dislike + 1;
        setDislike(updatedDislikeCount);
        setIsDisliked(!isDisliked);

        if (isLiked) {
            setLike(like - 1);
            setIsLiked(false);
        }

        try {
            const response = await axios.put(`${API_ENDPOINT}/thoughts/reply/${reply._id}/dislike`, {
                userId: currentuser._id,
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error disliking the reply:', error);
            // Handle error
        }

        if (!isDisliked) {
            socket.emit('sendNotification', {
                senderid: currentuser._id,
                receiverid: reply.userid,
                type: 'replyDisAgree',
            });
        }
    };

    return (
        <View style={styles.thoughtReplyContainer}>
            <View style={styles.thoughtReplyHeader}>
                <TouchableOpacity onPress={() => navigateToUserProfile(user._id)}>
                    <Image
                        source={user?.profilePic ? { uri: PF + user?.profilePic } : require('./background.png')}
                        style={styles.profilePic}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={styles.userName}>{user.userName}</Text>
                    <Text>{reply.text}</Text>
                </View>
            </View>
            <View style={styles.thoughtReplyActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => alert("reply is clicked")}>
                    {/* <Text style={styles.actionButtonText}>Reply</Text> */}
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={likeHandler}>
                    <Ionicons name={isLiked ? 'ios-thumbs-up' : 'ios-thumbs-up-outline'} size={20} color="#007aff" />
                    <Text>{like}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={dislikeHandler}>
                    <Ionicons name={isDisliked ? 'ios-thumbs-down' : 'ios-thumbs-down-outline'} size={20} color="#ff3b30" />
                    <Text>{dislike}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    thoughtReplyContainer: {
        marginBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgb(134, 134, 134)',
    },
    thoughtReplyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingLeft: 30,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontWeight: 'bold',
    },
    thoughtReplyActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Align actions horizontally with space between them
        paddingHorizontal: 30, // Adjust as needed
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    actionButtonText: {
        color: 'gray',
        marginLeft: 5, // Add space between icon and text
    },
});

export default ThoughtsReply;
