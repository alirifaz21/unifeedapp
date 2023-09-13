import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const UserProfileHeader = () => {
    const [message, setMessage] = React.useState('');
    const navigation = useNavigation(); // Initialize navigation hook

    const handleSend = () => {
        // Implement your send message logic here
        if (message.trim() !== '') {
            // Send the message
            console.log('Sending message:', message);
            // You can add your logic to send the message to a chat or server
            setMessage('');
        }
    };

    const handleUsernamePress = () => {
        // Navigate to the UserProfileScreen with the username as a parameter
        navigation.navigate('UserProfile', { username: 'Username' }); // Replace 'Username' with the actual username
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.leftContent} onPress={handleUsernamePress}>
                    <Image
                        source={{ uri: 'profile-pic-url' }}
                        style={styles.profilePic}
                    />
                    <Text style={styles.username}>Username</Text>
                </TouchableOpacity>
                <View style={styles.rightContent}>
                    <TouchableOpacity style={styles.icon}>
                        <Icon name="call" size={30} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon}>
                        <Icon name="videocam" size={30} color="blue" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon}>
                        <Icon name="ellipsis-vertical" size={30} color="orange" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.messageContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                />
                <TouchableOpacity style={styles.icon} onPress={handleSend}>
                    <Icon name="send" size={30} color="blue" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column', // Change to column to stack content vertically
        alignItems: "baseline", // Center content horizontally
        padding: 10,
        backgroundColor: '#F0F0F0', // Background color of the header
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 173,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: 'gray', // Placeholder background color
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginHorizontal: 5,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: 'white', // White background for the input field
        borderRadius: 20,
        paddingHorizontal: 10,
    },
});

export default UserProfileHeader;
