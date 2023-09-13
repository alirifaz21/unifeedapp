import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Feed from './Feed'
import { useRoute } from '@react-navigation/native';

const Home = ({ navigation }) => {

    return (
        
            <View>


                <Feed />
                {/* <Bottombar /> */}





            </View>
    )
}

export default Home

const styles = StyleSheet.create({})