import { StyleSheet, Text, View, Pressable } from "react-native";
import { Container, colors, fonts, width } from "../utils/generalStyles";
import { Formik } from "formik";
import { url } from "../utils/contants";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../components/Input";
import { useAuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
const Login = () => {
  const { setUser, setLoading } = useAuthContext();
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>Workers App</Text>
        <Text style={styles.subtitle}>Se Connecter</Text>
        <Formik
          initialValues={{ emailAddress: "", password: "" }}
          onSubmit={async (values) => {
            setLoading(true);
            await axios
              .post(`${url}UserLogin/Login`, values)
              .then((res) => {
                console.log(res.data.returnedUser);
                AsyncStorage.setItem(
                  "user",
                  JSON.stringify(res.data.returnedUser)
                );
                setUser(res.data.returnedUser);
                setLoading(false);
              })
              .catch((err) => {
                console.log(err), setLoading(false);
              });
          }}
        >
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            isValid,
            handleSubmit,
          }) => (
            <View style={styles.form}>
              <Input
                label="E-mail:"
                onBlur={() => setFieldTouched("emailAddress")}
                onChangeText={handleChange("emailAddress")}
                placeholder="email@email.com"
                error={
                  touched.emailAddress && errors.emailAddress
                    ? errors.emailAddress
                    : null
                }
                value={values.emailAddress}
              />
              <View style={styles.spacing} />
              <Input
                label="Password:"
                placeholder="*********"
                onBlur={() => setFieldTouched("password")}
                onChangeText={handleChange("password")}
                secureTextEntry={true}
                value={values.password}
                error={
                  touched.password && errors.password ? errors.password : null
                }
              />
              <View style={styles.spacing} />
              <Button title="Submit" onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    </Container>
  );
};

export default Login;

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 30,
    width: "100%",
  },
  spacing: {
    marginVertical: 15,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: width,
    paddingTop: 90,
  },
  title: {
    fontSize: fonts.xl,
    fontWeight: "600",
    color: colors.blueLavande,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: fonts.xxl,
    fontWeight: "600",
    color: colors.grey,
    marginBottom: 50,
  },
  extraInfo: {
    // flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  link: {
    textDecorationLine: "underline",
    marginBottom: 5,
    fontWeight: "500",
  },
});
