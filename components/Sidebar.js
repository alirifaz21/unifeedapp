import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const Sidebar = () => {
    return (
        <View style={styles.container}>
            {/* Sidebar menu items */}
            <TouchableOpacity style={styles.menuItem}>
                <Text>Menu Item 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Text>Menu Item 2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Text>Menu Item 3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Text>Menu Item 4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Text>Menu Item 5</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    menuItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
});

export default Sidebar;
