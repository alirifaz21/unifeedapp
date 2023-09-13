import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Axios from 'axios'; // You can replace this with your preferred networking library
import { useSelector } from 'react-redux';
import ThoughtsReplybox from './Thoughtsreplybox';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons

const API_ENDPOINT = 'http://192.168.56.1:8800/api';

function Thoughts({ thought, socket, navigation }) {
    const [like, setLike] = useState(thought.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [dislike, setDislike] = useState(thought.dislikes.length);
    const [isDisliked, setIsDisliked] = useState(false);
    const [user, setUser] = useState({});
    const [openReply, setOpenReply] = useState(false);
    const currentuser = useSelector((state) => state.user.user);

    const PF = "https://unifeed.s3.ap-south-1.amazonaws.com/";

    useEffect(() => {
        setIsLiked(thought.likes.includes(currentuser._id));
        setIsDisliked(thought.dislikes.includes(currentuser._id));
    }, [currentuser._id, thought.likes, thought.dislikes]);

    const likeHandler = async () => {
        const updatedLikeCount = isLiked ? like - 1 : like + 1;
        setLike(updatedLikeCount);
        setIsLiked(!isLiked);

        if (isDisliked) {
            setDislike(dislike - 1);
            setIsDisliked(false);
        }

        try {
            const res = await Axios.put(
                `${API_ENDPOINT}/thoughts/${thought._id}/like`,
                { userId: currentuser._id }
            );
            console.log(res);
        } catch (err) {
            // Handle error
        }
        if (!isLiked) {
            socket.emit('sendNotification', {
                senderid: currentuser._id,
                receiverid: thought.userid,
                type: 'thoughtsAgree',
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
            const res = await Axios.put(
                `${API_ENDPOINT}/thoughts/${thought._id}/dislike`,
                { userId: currentuser._id }
            );
            console.log(res);
        } catch (err) {
            // Handle error
        }
        if (!isDisliked) {
            socket.emit('sendNotification', {
                senderid: currentuser._id,
                receiverid: thought.userid,
                type: 'thoughtsDisAgree',
            });
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await Axios.get(`${API_ENDPOINT}/users/friend/${thought.userid}`);
                console.log("resdkfnvk ::::: ", res.data.profilePic)
                setUser(res.data);
            } catch (err) {
                // Handle error
            }
        };
        fetchUser();
    }, [thought.userid]);

    return (
        <View style={styles.thoughtContainer}>
            <TouchableOpacity
                style={styles.postProfile}
                onPress={() => navigation.navigate('Profile', { userId: user?._id })}
            >
                <Image
                    style={styles.postProfilePic}
                    source={
                        user?.profilePic
                            ? { uri: PF + user?.profilePic }
                            : require('./background.png')
                    }
                />
                <View style={styles.userInfo}>
                    <Text style={styles.thoughtsUsername}>{user.userName}</Text>
                    <Text style={{ paddingBottom: 7 }}>{thought.text}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.thoughtsActions}>
                <TouchableOpacity
                    style={styles.thoughtsAction}
                    onPress={() => setOpenReply(!openReply)}
                >
                    <Text style={{ color: 'gray', paddingBottom: 7 }}>Reply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.thoughtsAction} onPress={likeHandler}>
                    <Ionicons
                        name={isLiked ? 'ios-thumbs-up' : 'ios-thumbs-up-outline'}
                        size={20}
                        color="#007aff"
                    />
                    <Text>{like}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.thoughtsAction} onPress={dislikeHandler}>
                    <Ionicons
                        name={isDisliked ? 'ios-thumbs-down' : 'ios-thumbs-down-outline'}
                        size={20}
                        color="#ff3b30"
                    />
                    <Text>{dislike}</Text>
                </TouchableOpacity>
            </View>
            {openReply && <ThoughtsReplybox thoughtid={thought._id} socket={socket} thoughtuserid={thought.userid} />}
        </View>
    );
}

const styles = StyleSheet.create({
    thoughtContainer: {
        marginBottom: 10, // Add margin between each thought container
        padding: 10, // Add padding to the thought container
        backgroundColor: 'white', // Customize the background color
        borderRadius: 10, // Add rounded corners to the thought container
    },
    postProfile: {
        flexDirection: 'row', // To align profile pic and user info horizontally
        alignItems: 'center', // To vertically center align items
        // Add other styles as needed
    },
    postProfilePic: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 10, // Add margin to separate the profile pic from user info
    },
    userInfo: {
        flex: 1, // This allows user info to take remaining space
    },
    thoughtsActions: {
        flexDirection: 'row', // Align actions (Reply, Like, Dislike) horizontally
        alignItems: 'center', // Vertically center align actions
        // Add other styles as needed
    },
    thoughtsAction: {
        flexDirection: 'row', // To align icon and text horizontally
        alignItems: 'center', // Vertically center align icon and text
        paddingHorizontal: 5,
    },
    thoughtsUsername: {
        fontWeight: 'bold', // Add styles for username text
    },
    // Add other styles as needed
});

export default Thoughts;
