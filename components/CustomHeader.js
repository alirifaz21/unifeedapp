import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { SafeAreaView } from 'react-navigation';

const CustomHeader = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.menuIcon}
                onPress={() => navigation.toggleDrawer()} // Open the sidebar
            >
                <Ionicons name="menu-outline" size={30} color="white" />
            </TouchableOpacity>
            <TextInput
                style={styles.searchBar}
                placeholder="Search..."
            />
            <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => {
                    // Handle notification button press here
                }}>
                <Ionicons name="notifications" size={30} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#E7243B',
    },
    menuIcon: {
        marginLeft: 10,
    },
    searchBar: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
    },
    notificationButton: {
        marginLeft: 10,
    },
});

export default CustomHeader;
