import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getUser } from '../redux/userreducer';

import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Shares = ({ navigation }) => {
    const [desc, setDesc] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const dispatch = useDispatch();

    const handleDescChange = (text) => {
        setDesc(text);
    };

    const handleImageChange = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            console.log(result.assets[0].type)
            setImagePreview(result.assets[0].uri);
            setSelectedImage(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log("token in post :", token)
        const formData = new FormData();
        const postpic = Date.now() + ".jpg";
        formData.append('name', postpic);
        formData.append('image', {
            uri: selectedImage.uri,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        const user = {
            postpic: postpic,
            desc: desc,
        };

        try {
            // Upload the image to the server
            console.log("fetch started")
            const imageResponse = await fetch('http://192.168.56.1:8800/api/images/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (imageResponse.ok) {
                // If the image is uploaded successfully, proceed to share the post
                const postResponse = await fetch('http://192.168.56.1:8800/api/posts/', {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (postResponse.ok) {
                    console.log("Image selected is : ", selectedImage)
                    console.log("cdc", postResponse);
                    alert("done")
                    setDesc('');
                    setImagePreview(null);
                    setSelectedImage(null);
                    dispatch(getUser());


                } else {
                    console.error('Error sharing post:', postResponse.statusText);
                }
            } else {
                console.error('Error uploading image:', imageResponse.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.modalHeading}>Create Post</Text>
            <TextInput
                style={styles.modalInput}
                value={desc}
                onChangeText={handleDescChange}
                placeholder="Write caption here"
            />
            {imagePreview && (
                <Image
                    source={{ uri: imagePreview }}
                    style={styles.imagePreview}
                />
            )}
            <TouchableOpacity onPress={handleImageChange} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Select Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.shareButton}>
                <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 20,
    },
    uploadButton: {
        backgroundColor: '#218BF5',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    uploadButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    shareButton: {
        backgroundColor: '#2ECC71',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    shareButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default Shares;
