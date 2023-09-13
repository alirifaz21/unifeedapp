import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { TextInput, Checkbox, Button, Snackbar } from 'react-native-paper';
import api from '../api';
import * as Font from 'expo-font';


const RegistrationScreen = ({ navigation }) => {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');



    const handleSubmit = async () => {
        if (confirmPassword !== password) {
            setSnackbarText("Passwords don't match!");
            setSnackbarVisible(true);
        } else if (!privacyPolicyChecked) {
            setSnackbarText('Please agree to the privacy policy.');
            setSnackbarVisible(true);
        } else {
            const user = {
                userName: username,
                fullName: fullname,
                email: email,
                password: password,
                profileType: 'student',
            };

            try {
                console.log("start");
                console.log(user)

                const response = await fetch('http://192.168.56.1:8800/api/auth/register', {
                    method: 'POST',
                    headers: {

                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                    credentials: 'include',
                });

                console.log("first");

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Response data:', responseData);
                    await AsyncStorage.setItem('token', responseData.token);

                    navigation.navigate('otherinfo', { id: responseData._id })
                } else {
                    console.log('Response status:', response.status);
                    setSnackbarText('An error occurred during registration.');
                    setSnackbarVisible(true);
                }
            } catch (error) {
                console.log('Error:', error);
                setSnackbarText('An error occurred during registration.');
                setSnackbarVisible(true);
            }
        }
    };

    const handleLoginClick = () => {
        navigation.navigate("login")
    }


    return (

        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.fullform}>
                <View style={styles.registerLeftContainer}>
                    <Text style={[styles.registerHey, {
                        fontSize: 30,
                        fontWeight: 'bold'
                    }]}>HEY THERE!</Text>
                    <Text>Start your first step out of the BOX</Text>
                </View>
                <TextInput
                    label="Full Name"
                    value={fullname}
                    onChangeText={setFullname}
                    style={styles.input}
                />
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <View style={styles.checkboxContainer}>
                    <Checkbox.Android
                        status={privacyPolicyChecked ? 'checked' : 'unchecked'}
                        onPress={() => setPrivacyPolicyChecked(!privacyPolicyChecked)}
                        color="#007bff"
                    />
                    <Text style={styles.checkboxText}>I agree to the privacy policy</Text>
                </View>
                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                    Create Account
                </Button>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={5000}
                >
                    {snackbarText}
                </Snackbar>
                <View className="register-form-footer">
                    <Text>Already Have An Account?</Text>
                    <Text onPress={handleLoginClick} style={styles.loginLink}>
                        Login Here
                    </Text>
                </View>
            </View>
        </ScrollView>


    );
};

const styles = StyleSheet.create({
    fullform: {
        width: '100%',
        height: '89%',
        padding: 20,
        marginTop: 30,
        backgroundColor: 'white',
        borderRadius: 30, // Add border radius
        shadowColor: '#000', // Add box shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    registerLeftContainer: {
        width: '100%',
        textAlign: 'center',
        margin: 30,

    },
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "red"
    },
    input: {
        marginBottom: 10,
        backgroundColor: "aliceblue"
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxText: {
        marginLeft: 8,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#007bff',
        marginBottom: 10,
    },
    loginLink: {
        backgroundColor: "#fff",
        color: '#007bff',
    }
});

export default RegistrationScreen;
