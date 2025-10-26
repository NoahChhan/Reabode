import React from 'react';
import { ActivityIndicator, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import RecommendationsScreen from './src/screens/RecommendationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RoomAnalysisScreen from './src/screens/RoomAnalysisScreen';

// Theme
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = require('./assets/icons/House.png');
          } else if (route.name === 'Camera') {
            iconSource = require('./assets/icons/camera.png');
          } else if (route.name === 'Recommendations') {
            iconSource = require('./assets/icons/recommendations.png');
          } else if (route.name === 'Profile') {
            iconSource = require('./assets/icons/profile.png');
          } else {
            iconSource = require('./assets/icons/House.png');
          }

          return (
            <Image 
              source={iconSource} 
              style={{ 
                width: 36, 
                height: 36,
              }} 
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#5D8658',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 88,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: 'Poppins-Regular',
          marginTop: 4,
          marginBottom: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Recommendations" component={RecommendationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Light': require('./assets/fonts/poppins/Poppins-Light.ttf'),
    'Poppins-Regular': require('./assets/fonts/poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/poppins/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5D8658" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="RoomAnalysis" component={RoomAnalysisScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

