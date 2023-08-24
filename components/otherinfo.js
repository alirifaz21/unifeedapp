import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';


function OtherInfo({ navigation }) {
  const route = useRoute();
  const { id } = route.params;
  const [count, setCount] = useState(1);
  const [skills, setSkills] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [collegeName, setCollegeName] = useState('');
  const [collegeIdEntered, setCollegeIdEntered] = useState(false);
  const [headline, setHeadline] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSkillsChange = (value) => {
    setSkills(value);
  };

  const handleHeadlineChange = (value) => {
    setHeadline(value);
    setCollegeIdEntered(value.trim().length > 0);
  };

  const addSkill = () => {
    setAllSkills([...allSkills, skills]);
    setSkills('');
  };

  const deleteSkill = (index) => {
    const updatedSkills = [...allSkills];
    updatedSkills.splice(index, 1);
    setAllSkills(updatedSkills);
  };

  const handleImageChange = (assets) => {
    setSelectedImage(assets[0]);
    setImagePreview(assets[0].uri);
  };

  const handleImageGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result)
      handleImageChange(result.assets);
    }
  };


  const next = () => {
    setCount(count + 1);
  };

  const goBack = () => {
    setCount(count - 1);
  };

  const handleImageUpload = async () => {
    navigation.navigate('home');
    const formData = new FormData();
    const profilePic = Date.now() + selectedImage.name;
    formData.append('name', profilePic);
    formData.append('image', selectedImage);

    const user = {
      profilePic: profilePic,
    };

    try {
      console.log("first")
      const imageResponse = await fetch('http://192.168.56.1:8800/api/images/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("second");

      if (imageResponse.ok) {
        const userResponse = await fetch(`http://192.168.56.1:8800/api/auth/register/${id}`, {
          method: 'PUT',
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          navigation.navigate('home');
        } else {
          console.error('Error registering user:', userResponse.statusText);
        }
      } else {
        console.error('Error uploading image:', imageResponse.statusText);
      }
    } catch (error) {
      console.error('Error ui:', error);
    }
  };

  const handleSubmit = async () => {
    // Implement your submit logic here
    // This function seems to be incomplete in your original code
  };

  const progressSteps = ['1', '2', '3', '4'];

  const verify = async () => {
    console.log(id)
    try {
      const verifyResponse = await fetch(`http://192.168.56.1:8800/api/auth/verify/${id}`, {
        method: 'POST',
      });

      if (verifyResponse.ok) {
        setCount(count + 1);
      } else {
        console.error('Error verifying email:', verifyResponse.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addSkill();
    }
  };

  const renderContent = () => {
    if (count === 1) {
      return (
        <View style={styles.container}>
          <Text style={styles.verifytext}>Verify Email</Text>
          <Button title="Next" onPress={verify} />
        </View>
      );
    } else if (count === 2) {
      return (
        <View style={styles.container}>
          <Text>Skills</Text>
          <TextInput
            type="text"
            value={skills}
            onChangeText={handleSkillsChange}
            onKeyPress={handleKeyPress}
          />
          <Button title="Add" style={styles.addskill} onPress={addSkill} />
          <View>
            {allSkills.map((element, index) => (
              <View key={index}>
                <Text>{element} <Text style={{ backgroundColor: "red", color: "white" }} onPress={() => deleteSkill(index)}>X</Text></Text>

              </View>
            ))}
          </View>
          <View style={styles.buttonsnb}>

            <Button title="Back" onPress={goBack} />
            <Button title="Next" onPress={next} />
          </View>
        </View>
      );
    } else if (count === 3) {
      return (
        <View style={styles.container}>
          <Text>College ID</Text>
          <TextInput
            type="text"
            value={headline}
            onChangeText={handleHeadlineChange}
            required
          />
          <View style={styles.buttonsnb}>

            <Button
              title="Back"
              onPress={goBack}
            />
            <Button
              title="Next"
              onPress={next}
              disabled={!collegeIdEntered}
            />
          </View>
          <Text>*Please enter your college ID*</Text>
        </View>
      );
    } else if (count === 4) {
      return (
        <View style={styles.container}>
          <Text>Profile Picture</Text>
          {imagePreview && (
            <Image
              source={{ uri: imagePreview }}
              style={styles.imagePreview}
            />
          )}
          <View style={styles.buttonsnb}>
            <Button title="Select Image" onPress={handleImageGallery} />
            <Button title="Upload" onPress={handleImageUpload} />
          </View>
          <Button title="Back" onPress={goBack} />
        </View>
      );
    }
  };

  return (
    <View style={styles.otherinfoBody}>
      <View style={styles.otherContainer}>
        <Text style={styles.headtext}>Complete Your Profile</Text>
        {/* Progress bar */}
        <View style={styles.progressBar}>
          {progressSteps.map((step, index) => (
            <View
              key={index}
              style={count === index + 1 ? styles.activeStep : styles.step}
            >
              {/* Tick mark icon */}
              {/* {count > index + 1 && <Text>✔️</Text>} */}
            </View>
          ))}
        </View>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  otherinfoBody: {
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
  },
  otherContainer: {
    backgroundColor: "#fff",
    marginTop: 250,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    width: "70%",
    marginLeft: "15%",
    padding: 30,
    borderRadius: 20
  },
  headtext: {
    paddingBottom: "10%",
    fontSize: 23
  },
  verifytext: {
    marginBottom: 10
  },
  buttonsnb: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 20,
    width: "100%",
    justifyContent: "space-around"
  },
  addskill: {
    marginBottom: 0,
  }
});

export default OtherInfo;
