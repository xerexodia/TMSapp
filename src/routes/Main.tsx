import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuthContext } from "../context/AuthContext";
import Login from "../screens/Login";
import AdminMain from "./admin/AdminMain";
import ClientMain from "./client/ClientMain";

const Main = () => {
  const { user } = useAuthContext();
  console.log(user);
  if (user) {
    if (user.isAdmin) {
      return (
        <>
          <AdminMain />
        </>
      );
    } else {
      return (
        <>
          <ClientMain />
        </>
      );
    }
  }
  return <Login />;
};

export default Main;

const styles = StyleSheet.create({});
