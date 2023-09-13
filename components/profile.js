import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Modal from './Modal';
import Feed from './Feed';
import Post from './Post';


const API_URL = 'http://192.168.56.1:8800/api';


const Profile = ({ userId, navigation }) => {


    const PF = "https://unifeed.s3.ap-south-1.amazonaws.com/";
    const [data, setData] = useState(null)
    const [showModalabout, setShowModalabout] = useState(false);
    const [showModalposting, setShowModalposting] = useState(false);
    const [about, setAbout] = useState("");
    const [user, setUser] = useState(null);
    const [update, setUpdate] = useState(false);
    const [skills, setSkills] = useState([]);
    const [posts, setPosts] = useState([]);
    const currentuser = useSelector((state) => state.user.user);



    const handleopenmodalposting = () => {
        setShowModalposting(true);
    };

    const handleCloseModalPosting = () => {
        setShowModalposting(false);
    };


    const handleOpenModalAbout = () => {
        setShowModalabout(true);
    };


    const handleCloseModalAbout = () => {
        setShowModalabout(false);
    };

    const sharepage = () => {
        navigation.navigate('share');
    };



    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/auth`);
                const data = await response.json();
                setUser(data);
                // console.log(data)
            } catch (err) {
                // Handle the error case when the API call fails
                console.error('Failed to fetch user data:', err);
            }
        };
        getUsers();
    }, []);

    useEffect(() => {
        const loaddata = async () => {
            try {
                console.log("login done")
                const response = await fetch(`${API_URL}/users/${currentuser?._id}`);
                // console.log("API Response:", response);

                const data = await response.json();
                // console.log(data)

                if (!data) {
                    navigation.navigate('login');
                } else {
                    const tdata = data.data;
                    const tupdate = data.update;
                    setData(tdata);
                    setUpdate(tupdate);
                    setSkills(tdata.skills);
                }
            } catch (err) {
                console.log(err);
            }
        };
        loaddata();
    }, []);





    useEffect(() => {
        const fetchPosts = async () => {
            let res;
            try {
                console.log("first")

                console.log("started")
                res = await fetch(`${API_URL}/posts/profile/${currentuser?._id}`);
                // console.log("response 1 :", res)


                // console.log(res)

                if (res) {
                    console.log("inside if res")
                    const responseData = await res.json();
                    console.log(responseData)

                    // Sort the data by createdAt property in descending order
                    const sortedPosts = responseData.sort(
                        (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
                    );

                    // Set the sorted posts to the state
                    setPosts(sortedPosts);
                }

            } catch (error) {
                console.log("under catch")
                console.error('Error fetching posts:', error);
            }


        };

        fetchPosts();
    }, [user]);










    //about

    const updateAbout = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/register/${currentuser?._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ about }),
            });

            if (response.ok) {
                // Update the data with the new about information
                const updatedData = { ...data, about };
                setData(updatedData);

                handleCloseModalAbout();
            } else {
                console.error('Failed to update about information');
            }
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={data?.profilePic ? { uri: PF + data.profilePic } : require('./background.png')}
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.username}>@{data?.userName}</Text>
                    <Text style={styles.fullName}>{data?.fullName}</Text>
                    {/* {console.log("Post : ", posts)} */}
                </View>
                <View style={styles.profileAbout}>
                    <Text style={styles.aboutTitle}>About</Text>
                    <Text>{data?.about || 'No information available'}</Text>
                    {update && (
                        <TouchableOpacity onPress={handleOpenModalAbout} style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {/* <Modal visible={showModalabout} animationType="slide">
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalHeading}>Update About</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={about}
                            onChangeText={setAbout}
                            placeholder="Enter new about information"
                        />
                        <TouchableOpacity onPress={updateAbout} style={styles.updateButton}>
                            <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCloseModalAbout} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal> */}

            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={{
                    backgroundColor: "#e6243b", padding: 10,
                    borderRadius: 5, flex: 1, marginHorizontal: 5,
                }}>
                    <Text style={styles.buttonText}>Connect</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Schedule Meeting</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonmsg}>
                    <Ionicons name="chatbox-outline" size={30} color="red" />
                </TouchableOpacity>
            </View>
            <View style={styles.skillsContainer}>
                <Text style={styles.skillsHeading}>Skills</Text>
                <View style={styles.skillsRow}>
                    {skills.map((skill, index) => (
                        <View style={styles.skillBox} key={index}>
                            <Text style={styles.skillText}>{skill}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.badgesContainer}>
                <Text style={styles.badgesHeading}>Badges</Text>
                <View style={styles.badgesRow}>
                    <View style={styles.badge}>
                        <Image
                            source={require('./background.png')}
                            style={styles.badgeImage}
                        />
                    </View>
                    <View style={styles.badge}>
                        <Image
                            source={require('./google.png')}
                            style={styles.badgeImage}
                        />
                    </View>
                    <View style={styles.badge}>
                        <Image
                            source={require('./background.png')}
                            style={styles.badgeImage}
                        />
                    </View>
                    <View style={styles.badge}>
                        <Image
                            source={require('./google.png')}
                            style={styles.badgeImage}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.boxesContainer}>
                <View style={styles.box}>
                    <View style={{
                        backgroundColor: '#EEDF41',
                        padding: 5,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10, marginBottom: 5,
                    }}>
                        <Text style={styles.boxHeaderText}>Activity</Text>
                    </View>
                    <View style={styles.boxContent}>
                        <Text>Photography</Text>
                        <Text>Content Creation</Text>
                        <Text>Digital Marketing</Text>
                        <Text>Search Engine Optimization</Text>
                        {/* Add more items as needed */}
                    </View>
                </View>
                <View style={styles.box}>
                    <View style={styles.boxHeader}>
                        <Text style={styles.boxHeaderText}>Clubs</Text>
                    </View>
                    <View style={styles.boxContent}>
                        <Text>Eddie Haung</Text>
                        <Text>Glug</Text>
                        <Text>Zycon</Text>
                        <Text>Solo</Text>
                        {/* Add more items as needed */}
                    </View>
                </View>
                <View style={styles.box}>
                    <View style={{
                        backgroundColor: 'blue',
                        padding: 5,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10, marginBottom: 5,
                    }}>
                        <Text style={styles.boxHeaderText}>Courses</Text>
                    </View>
                    <View style={styles.boxContent}>
                        <Text>Physiotherapy</Text>
                        <Text>Electronics</Text>
                        {/* Add more items as needed */}
                    </View>
                </View>
            </View>

            {/* Bottom Navigation Bar */}
            <View style={styles.postSection}>
                <Text style={styles.skillsHeading}>Posts</Text>
                <View style={styles.postsRow}>
                    {posts?.map((p, index) => (
                        <View style={styles.post} key={index}>
                            <Image
                                source={p?.postpic ? { uri: PF + p.postpic } : require('./background.png')}
                                style={styles.postImage}
                            />
                        </View>
                    ))}
                </View>
            </View>

        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E9F5FC',
        padding: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 50,
        marginRight: 10,
    },
    profileInfo: {
        flex: 1,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    fullName: {
        fontSize: 16,
        color: 'gray',
        fontWeight: 'bold'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: 'blue',
        padding: 3,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    skillsContainer: {
        marginTop: 20,
    },
    skillsHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillBox: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
        shadowColor: 'rgba(0, 0, 0, 0.9)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },

    skillText: {
        fontSize: 16,
    },
    badgesContainer: {
        marginTop: 20,
    },
    badgesHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    badgesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    badge: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: 'blue', // Change this to your preferred badge color
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeImage: {
        width: 40,
        height: 40,
        // Add any additional image styles you need
    },
    boxesContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    box: {
        width: '30%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 0,
        marginBottom: 10,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    boxHeader: {
        backgroundColor: 'red',
        padding: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 5,
        width: '100%'
    },
    boxHeaderText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    boxContent: {
        textAlign: 'center',
        padding: 10,
    },
    postSection: {
        marginTop: 20,
    },
    postHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    postsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    post: {
        width: '30%', // Adjust as needed for your layout
        marginBottom: 20,
    },
    postImage: {
        width: '100%',
        height: 120, // Adjust as needed for your layout
        resizeMode: 'cover',
        borderRadius: 10,
    },
    postCaption: {
        marginTop: 5,
    },

    bottomNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    iconContainer: {
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalInput: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    uploadButton: {
        backgroundColor: '#e6243b',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Profile;
