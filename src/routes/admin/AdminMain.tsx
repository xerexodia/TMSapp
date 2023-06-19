import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Users from "../../screens/admin/Users";
import Machines from "../../screens/admin/Machines";
import { createStackNavigator } from "@react-navigation/stack";
import UserMachines from "../../screens/admin/UserMachines";
import MachineDetails from "../../screens/admin/MachineDetails";
import Visits from "../../screens/admin/Visits";
import Profile from "../../screens/admin/Profile";
import InfoClient from "../../screens/admin/InfoClient";

const Stack = createStackNavigator();

const ProfileNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Users"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="UserList" component={Users} />
      <Stack.Screen name="UserMachines" component={UserMachines} />
      <Stack.Screen name="MachineDetails" component={MachineDetails} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();
const AdminMain = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Users"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Users" component={ProfileNav} />
      <Drawer.Screen name="Machines" component={Machines} />
      <Drawer.Screen name="Visits" component={Visits} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Info" component={InfoClient} />
    </Drawer.Navigator>
  );
};

export default AdminMain;

const styles = StyleSheet.create({});
