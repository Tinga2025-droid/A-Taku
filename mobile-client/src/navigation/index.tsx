import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import HomeScreen from '../screens/HomeScreen';
import SendScreen from '../screens/SendScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useSession } from '../store/useSession';
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
function AppTabs() { return (
  <Tabs.Navigator screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="Home" component={HomeScreen} />
    <Tabs.Screen name="Send" component={SendScreen} />
    <Tabs.Screen name="History" component={HistoryScreen} />
    <Tabs.Screen name="Settings" component={SettingsScreen} />
  </Tabs.Navigator>
); }
export default function Router() {
  const token = useSession(s => s.token);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (<Stack.Screen name="Tabs" component={AppTabs} />) : (<>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
        </>)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
