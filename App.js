import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomHeader from "./components/CustomHeader"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/home';
import OtherInfoScreen from './components/otherinfo';
import Profile from './components/profile';
import Post from './components/Post';
import Shares from './components/Shares';
import Feed from './components/Feed';
import Message from './components/Message';
import Course from './components/Course';
import Club from './components/Club';

const homeName = 'Home';
const messageName = 'Message';
const createPostName = 'Shares';
const courseName = 'Course';
const clubName = 'Club';

const getTabBarIcon = (routeName, focused, color, size) => {
  let iconName;

  if (routeName === homeName) {
    iconName = focused ? 'home' : 'home-outline';
  } else if (routeName === messageName) {
    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
  } else if (routeName === createPostName) {
    iconName = focused ? 'add-circle' : 'add-circle-outline';
  } else if (routeName === courseName) {
    iconName = focused ? 'book' : 'book-outline';
  } else if (routeName === clubName) {
    iconName = focused ? 'people' : 'people-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabBarIcon(route.name, focused, color, size);
          return iconName;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#E7243B',
        inactiveTintColor: 'grey',
        labelStyle: { paddingBottom: 10, fontSize: 10 },
        style: { padding: 20, height: 90 },
      }}>
      <Tab.Screen name={homeName} component={Home} />
      <Tab.Screen name={messageName} component={Message} />
      <Tab.Screen name={createPostName} component={Shares} />
      <Tab.Screen name={courseName} component={Course} />
      <Tab.Screen name={clubName} component={Profile} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="login" screenOptions={({ navigation, route }) => ({
            header: () => route.name !== 'login' && route.name !== 'register' ? <CustomHeader navigation={navigation} /> : null, // Conditional header rendering
          })}>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register" component={Register} />
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="otherinfo" component={OtherInfoScreen} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="share" component={Shares} />
            <Stack.Screen name="feed" component={Feed} />
            <Stack.Screen name="MainBottomTab" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 30,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigtext: {
    fontSize: 20,
    marginBottom: 35,
  },
});
