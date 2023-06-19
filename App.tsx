import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import Input from "./src/components/Input";
import Login from "./src/screens/Login";
import AdminMain from "./src/routes/admin/AdminMain";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./src/routes/Main";
import AuthContext, { useAuthContext } from "./src/context/AuthContext";
export default function App() {
  const { user } = useAuthContext();
  console.log(user);
  return (
    <NavigationContainer>
      <AuthContext>
        <Main />
      </AuthContext>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
