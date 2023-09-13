import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Post from './Post';
// import Search from '../search/Search';
import Share from './Shares';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons'; // Using icons from Expo vector icons library
import Shares from './Shares';
import { FlatList } from 'react-native-gesture-handler';
const API_URL = 'http://192.168.56.1:8800/api';

const Feed = ({ userId, socket }) => {
    const user = useSelector((state) => state.user.user);
    // console.log("The current user is : ", user)
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            let res;
            try {
                console.log("first")

                // console.log("started")
                res = await fetch(`${API_URL}/posts/profile/${user?._id}`);
                console.log("response 1 :", res
                )

                if (res) {
                    const responseData = await res.json();

                    // Sort the data by createdAt property in descending order
                    const sortedPosts = responseData.sort(
                        (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
                    );

                    // Set the sorted posts to the state
                    setPosts(sortedPosts);
                }
            } catch (error) {
                // console.log("under catch")
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [userId, user]);

    return (
        <ScrollView style={styles.feed}>
            <View style={styles.feedWrapper}>
                {posts?.map((p) => (
                    <Post key={p._id} post={p} socket={socket} />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    feed: {
        width: '100%',
        backgroundColor: 'white',
        borderBlockColor: 'green'

    },
    feedWrapper: {
        padding: 15,
        marginBottom: 27
    },
});

export default Feed;
