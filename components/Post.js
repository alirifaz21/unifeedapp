import React from 'react';
import { View, ScrollView, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
const API_URL = 'http://192.168.56.1:8800/api';
import axios from 'axios';
import Thoughtbox from './Thoughtbox';
import { FlatList } from 'react-native-gesture-handler';


const Post = ({ post, navigation, socket }) => {

    const route = useRoute();

    const PF = "https://unifeed.s3.ap-south-1.amazonaws.com/";

    const [like, setLike] = useState(post?.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [data, setData] = useState(null)
    const [update, setUpdate] = useState(null)
    const [user, setUser] = useState({});
    const [isThought, setisThought] = useState(false);
    const [thought, setthought] = useState([]);
    const currentuser = useSelector((state) => state.user.user);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        setIsLiked(post?.likes.includes(currentuser?._id));
    }, [currentuser, post?.likes]);










    useEffect(() => {
        const loaddata = async () => {
            try {
                // console.log("login done")
                const response = await fetch(`${API_URL}/users/${currentuser?._id}`);
                // console.log("API Response:", response);

                const data = await response.json();
                // console.log(data)

                if (!data) {
                    navigation.navigate('login');
                } else {
                    const tdata = data.data;
                    // console.log(tdata)
                    const tupdate = data.update;
                    setData(tdata);
                    setUpdate(tupdate);
                    console.log(tdata.profilePic)
                    // setSkills(tdata.skills);
                    // setPost(tdata.postpic)
                }
            } catch (err) {
                console.log(err);
            }
        };
        loaddata();
    }, []);








    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/friend/${post.userid}`);
            // console.log("uuser now == : ", res.data)
            setUser(res.data);
        };
        fetchUser();
    }, [post.userid]);


    useEffect(() => {
        const fetchthoughts = async () => {
            const res = await axios.get(`${API_URL}/thoughts/${post?._id}`);
            setthought(res.data);
        };
        fetchthoughts();
    }, []);

    const likeHandler = async () => {
        try {
            // Send a PUT request to update the like status for the post
            await axios.put(`${API_URL}/posts/${post._id}/like`, { userId: currentuser._id });
        } catch (err) {
            console.error('Error while updating like:', err);
        }

        // Update the like count and like status locally
        setLike(prevLike => (isLiked ? prevLike - 1 : prevLike + 1));
        setIsLiked(prevIsLiked => !prevIsLiked);

        // Emit a notification if the post is being liked
        if (!isLiked) {
            socket.emit('sendNotification', {
                senderid: currentuser._id,
                receiverid: post.userid,
                type: 'post',
            });
        }
    };



    const thoghtHandler = () => {
        setisThought(prevIsThought => !prevIsThought);
    }


    function loadMoreData() {
        // Your code to load more data or perform any action when reaching the end of the page
        console.log('Reached the end of the page!');
    }

    // window.addEventListener('scroll', function () {
    //     // Calculate the total height of the page
    //     const totalPageHeight = document.body.scrollHeight;

    //     // Calculate the height of the viewport
    //     const viewportHeight = window.innerHeight;

    //     // Calculate the current scroll position
    //     const scrollPosition = window.scrollY;

    //     // Check if the user has reached the end of the page
    //     if (scrollPosition + viewportHeight >= totalPageHeight) {
    //         // Call the function to load more data or perform any action
    //         loadMoreData();
    //     }
    // });




    return (
        <View>

            <View>

                <View style={styles.header}>
                    <Image
                        source={data?.profilePic ? { uri: PF + data.profilePic } : require('./background.png')}
                        style={styles.profileImage}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{data?.userName}</Text>
                        <Text style={styles.timeAgo}>15 minutes ago</Text>
                    </View>
                </View>

                {/* Caption */}
                <View style={styles.caption}>
                    <Text>
                        {post?.desc}
                    </Text>
                </View>

                {/* Post Image */}
                {console.log(post.postpic)}
                <Image
                    source={post?.postpic ? { uri: PF + post.postpic } : require('./natures.png')}
                    style={styles.postImage}
                />
                <Text>{like} likes</Text>

                {/* Icons */}
                <View style={styles.iconsContainer}>
                    <TouchableOpacity style={styles.icon} onPress={likeHandler}>
                        <Ionicons name={isLiked ? 'ribbon' : 'ribbon-outline'} size={25} color="gray" />
                        <Text style={styles.icontext}>Prise</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon} onPress={thoghtHandler}>
                        <Ionicons name="chatbubble-ellipses" size={25} color="gray" />
                        <Text style={styles.icontext}>Thoughts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon}>
                        <Ionicons name="paper-plane" size={25} color="gray" />
                        <Text style={styles.icontext}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}

                {/* User Input */}
                <View style={styles.userInputContainer}>
                    {/* <Image
                        source={data?.profilePic ? { uri: PF + data.profilePic } : require('./background.png')}
                        style={styles.userInputProfileImage}
                    />
                    <TextInput
                        style={styles.userInput}
                        placeholder="Share your thoughts..."
                    /> */}

                    {isThought && (
                        <View>
                            <Thoughtbox thoughts={thought} postid={post._id} socket={socket} postids={post.userid} />
                        </View>
                    )}
                </View>
                <View style={styles.divider} />

            </View>
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#E9F5FC',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    profileSection: {
        flex: 1,
        alignItems: 'flex-start',
    },
    profileImage: {
        width: 70,
        height: 50,
        borderRadius: 40,
    },
    searchSection: {
        flex: 3,
        paddingHorizontal: 10,
    },
    searchInput: {
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 20,
        shadowColor: 'rgba(0, 0, 0, 0.9)',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 14,
    },
    notificationSection: {
        flex: 1,
        alignItems: 'flex-end',
    },


    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userInfo: {
        marginLeft: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#218BF5',

    },
    timeAgo: {
        fontSize: 12,
        color: '#666',
    },
    caption: {
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: 15
    },
    icon: {
        display: 'flex',
        flexDirection: "row",
        width: 60,
        height: 40,
        fontWeight: "bold",
        // Add icon styling
    },

    icontext: {
        paddingTop: 5,
        color: 'black'
    },
    divider: {
        height: 2,
        backgroundColor: '#ddd',
        marginBottom: 10,
        marginTop: 10
    },
    userInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInputProfileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    userInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: 14,
    },
    // Add styles for your notification icon component here
});

export default Post;
