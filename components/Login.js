import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import api from '../api';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');

    const handleSubmit = async () => {
        const user = {
            userName: username,
            password: password,
        };
        console.log(user)

        try {
            console.log("first")
            const response = await fetch('http://192.168.56.1:8800/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            console.log("last")
            if (response.ok) {
                const responseData = await response.json();
                console.log('Response data:', responseData);
                navigation.navigate('Profile', { id: responseData._id })
            } else {
                console.log('Response status:', response.status);
                setSnackbarText('An error occurred during registration.');
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.log('Error:', error.message);
            setSnackbarText('Invalid username or password.');
            setSnackbarVisible(true);
        }
    };

    const handleSignupClick = () => {
        navigation.navigate('register');
    };

    return (

        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.fullform}>
                <View style={styles.loginLeftContainer}>
                    <Text style={styles.loginWelcomeText}>Welcome!</Text>
                    <Text style={styles.loginSubText}>Please log in to your account.</Text>
                </View>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                    <Text>Login</Text>
                </Button>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={5000}
                >
                    {snackbarText}
                </Snackbar>
                <View style={styles.loginFormFooter}>
                    <Text>Don't have an account?</Text>
                    <Text onPress={handleSignupClick} style={styles.signupLink}>
                        Sign Up Here
                    </Text>
                </View>
            </View>
        </ScrollView >

    );
};

const styles = StyleSheet.create({
    fullform: {
        backgroundColor: '#fff',
        width: '90%',
        marginTop: 140,
        marginLeft: 15,
        padding: 10,
        height: '53%',
        borderRadius: 25,
    },
    loginLeftContainer: {
        width: '100%',
        textAlign: 'center',
        margin: 30,
    },
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "red",

    },
    loginWelcomeText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    input: {
        marginBottom: 10,
        backgroundColor: "aliceblue",
        width: '100%',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#007bff',
    },
    loginFormFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signupLink: {
        marginLeft: 8,
        color: '#007bff',
    },
});

export default LoginScreen;
