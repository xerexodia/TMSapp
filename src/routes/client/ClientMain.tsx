import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../../screens/client/Profile";
import Material from "../../screens/client/Material";
import ContactAdmin from "../../screens/client/ContactAdmin";
import BonCommande from "../../screens/client/BonCommande";
import { useAuthContext } from "../../context/AuthContext";

const Stack = createStackNavigator();

const ProfileNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Material"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Material" component={Material} />
      {/* <Stack.Screen name="UserMachines" component={UserMachines} />
      <Stack.Screen name="MachineDetails" component={MachineDetails} /> */}
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();
const ClientMain = () => {
  const { user } = useAuthContext();
  return (
    <Drawer.Navigator
      initialRouteName="Materials"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Materials" component={ProfileNav} />
      <Drawer.Screen name="Contact" component={ContactAdmin} />
      {!user.isContracted && (
        <Drawer.Screen name="Bon" component={BonCommande} />
      )}

      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};

export default ClientMain;

const styles = StyleSheet.create({});
