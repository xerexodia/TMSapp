import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import Button from "../../components/Button";
import { fonts } from "../../utils/generalStyles";

const Profile = () => {
  const { user, logout } = useAuthContext();
  console.log(user);
  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={styles.text}>Email: {user.emailAddress}</Text>
        <Text style={styles.text}>Name: {user.userName}</Text>
        <Text style={styles.text}>Téléphone: {user.phoneNumber}</Text>
        <Text style={styles.text}>
          contracted: {Boolean(user.isAdmin).toString()}
        </Text>
      </View>
      <Button title="Déconnecter" onPress={logout} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "white",
  },
  text: {
    fontSize: fonts.m,
  },
});
