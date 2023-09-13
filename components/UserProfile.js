import React from 'react';
import { View, Text } from 'react-native';

const UserProfileScreen = ({ route }) => {
    // You can access the user information from the route.params object
    const { username } = route.params;

    return (
        <View>
            <Text>User Profile for: {username}</Text>
            {/* Add your user profile details here */}
        </View>
    );
};

export default UserProfileScreen;
