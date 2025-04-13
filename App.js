import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import LoginScreen from './screens/LoginScreen';
import OfficerDashboard from './screens/OfficerDashboard';
import ShiftScreen from './screens/ShiftScreen';
import TaskScreen from './screens/TaskScreen';
import GeolocationScreen from './screens/GeolocationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator for authenticated users
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Shifts') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Tasks') {
            iconName = focused ? 'clipboard-check' : 'clipboard-outline';
          } else if (route.name === 'Location') {
            iconName = focused ? 'map-marker' : 'map-marker-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#1976d2',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Dashboard" component={OfficerDashboard} />
      <Tab.Screen name="Shifts" component={ShiftScreen} />
      <Tab.Screen name="Tasks" component={TaskScreen} />
      <Tab.Screen name="Location" component={GeolocationScreen} />
    </Tab.Navigator>
  );
};

// Root navigator
const App = () => {
  // In a real app, we would check if the user is authenticated
  const isAuthenticated = false;

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={MainTabNavigator} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
