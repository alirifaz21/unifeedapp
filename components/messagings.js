import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';

// Sample data for followers with profile pictures, usernames, and last messages
const followersData = [
    { id: '1', username: 'User1', profile: 'Profile1', lastMessage: 'Hi there!', profilePic: 'google.png' },
    { id: '2', username: 'User2', profile: 'Profile2', lastMessage: 'Hello!', profilePic: 'background.png' },
    { id: '3', username: 'User3', profile: 'Profile3', lastMessage: 'Hey!', profilePic: 'natures.png' },
];

const FollowersList = () => {
    return (
        <FlatList
            data={followersData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.listItem}>
                    <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
                    <View>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                    </View>
                </View>
            )}
        />
    );
};

const MessageScreen = () => {
    const [activeButton, setActiveButton] = useState('personal');
    const [content, setContent] = useState(null);

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
        switch (buttonType) {
            case 'personal':
                setContent(<FollowersList />);
                break;
            case 'groups':
                setContent(<Text>This is group message.</Text>);
                break;
            case 'clubs':
                setContent(<Text>This is club.</Text>);
                break;
            default:
                setContent(null);
                break;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, activeButton === 'personal' && styles.activeButton]}
                    onPress={() => handleButtonClick('personal')}
                >
                    <Text style={[styles.buttonText, activeButton === 'personal' && styles.activeButtonText]}>Personal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, activeButton === 'groups' && styles.activeButton]}
                    onPress={() => handleButtonClick('groups')}
                >
                    <Text style={[styles.buttonText, activeButton === 'groups' && styles.activeButtonText]}>Groups</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, activeButton === 'clubs' && styles.activeButton]}
                    onPress={() => handleButtonClick('clubs')}
                >
                    <Text style={[styles.buttonText, activeButton === 'clubs' && styles.activeButtonText]}>Clubs</Text>
                </TouchableOpacity>
            </View>
            {content && <View style={styles.contentContainer}>{content}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Align buttons evenly
        width: '100%', // Occupy full width of the screen
    },
    button: {
        flex: 1, // Equal width for all buttons
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'gray',
    },
    activeButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center', // Center button text
    },
    activeButtonText: {
        color: 'black',
    },
    contentContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: "green",
        width: "100%"
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "red",
        marginRight: 10,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 14,
    },
});

export default MessageScreen;
