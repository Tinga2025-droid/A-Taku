import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import DepositScreen from '../screens/DepositScreen';
import CashoutScreen from '../screens/CashoutScreen';
import { useAgent } from '../store/useAgent';
const Stack=createNativeStackNavigator(); const Tabs=createBottomTabNavigator();
function AppTabs(){ return (<Tabs.Navigator screenOptions={{headerShown:false}}>
  <Tabs.Screen name="Depositar" component={DepositScreen}/>
  <Tabs.Screen name="Levantar" component={CashoutScreen}/>
</Tabs.Navigator>); }
export default function Router(){ const token=useAgent(s=>s.token); return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown:false}}>
      {token? <Stack.Screen name="Tabs" component={AppTabs}/> : <Stack.Screen name="Login" component={LoginScreen}/>}
    </Stack.Navigator>
  </NavigationContainer>
); }
