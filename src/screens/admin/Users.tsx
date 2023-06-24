import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../utils/contants";
import Button from "../../components/Button";
import { fonts } from "../../utils/generalStyles";
import Modal from "react-native-modal";
import KeyboardWrapper from "../../components/KeyBoardWrapper";
import Input from "../../components/Input";
import { Formik } from "formik";
import { Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Scanner from "../../components/Scanner";

const Users = () => {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [contracted, setContracted] = useState(false);
  const getUsers = async () => {
    return await axios.get(`${url}Profile/AllUsers`);
  };

  useEffect(() => {
    getUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liste des utilisateurs</Text>
        <Button title="ajouter" onPress={() => setShow(true)} />
      </View>
      <ScrollView style={styles.scroll}>
        {users?.map((item: any, idx: number) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("UserMachines", { id: item.id })}
            key={idx}
            style={styles.card}
          >
            <Text style={styles.text}>id: {item.id}</Text>
            <Text style={styles.text}>email: {item.emailAddress}</Text>
            <Text style={styles.text}>name: {item.userName}</Text>
            <Text style={styles.text}>téléphone: {item.phoneNumber}</Text>
            <Text style={styles.text}>
              isContracted: {Boolean(item.isContacted).toString()}
            </Text>
            <Text style={styles.text}>
              isAdmin: {Boolean(item.isAdmin).toString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        style={{ margin: 0 }}
        isVisible={show}
        onBackdropPress={() => setShow(false)}
        backdropOpacity={0.1}
        swipeDirection={"down"}
        scrollHorizontal={true}
        avoidKeyboard={true}
        onSwipeComplete={() => setShow(false)}
      >
        <View style={styles.postModalContainer}>
          <KeyboardWrapper>
            <Formik
              initialValues={{
                userName: "",
                password: "",
                emailAddress: "",
                phoneNumber: "",
              }}
              onSubmit={async (values) => {
                await axios
                  .post(`${url}Profile/AddUser`, {
                    userName: values.userName,
                    emailAddress: values.emailAddress,
                    password: values.password,
                    isAdmin: admin ? 1 : 0,
                    isContracted: contracted ? 1 : 0,
                    phoneNumber: values.phoneNumber,
                  })
                  .then((res) => {
                    console.log(res.data);
                    setUsers((prev: any) => [res.data, ...prev]);
                    setShow(false);
                  })
                  .catch((err) => {
                    console.log(err);
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
                <View>
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
                      touched.password && errors.password
                        ? errors.password
                        : null
                    }
                  />
                  <Input
                    label="Name:"
                    placeholder="name"
                    onBlur={() => setFieldTouched("userName")}
                    onChangeText={handleChange("userName")}
                    value={values.userName}
                    error={
                      touched.userName && errors.userName
                        ? errors.userName
                        : null
                    }
                  />
                  <Input
                    label="Telephone:"
                    placeholder="33 200 100"
                    onBlur={() => setFieldTouched("phoneNumber")}
                    onChangeText={handleChange("phoneNumber")}
                    value={values.phoneNumber}
                    error={
                      touched.phoneNumber && errors.phoneNumber
                        ? errors.phoneNumber
                        : null
                    }
                  />

                  <View style={styles.spacing} />
                  <Checkbox.Item
                    label="is Admin"
                    status={admin ? "checked" : "unchecked"}
                    onPress={() => setAdmin(!admin)}
                  />
                  <Checkbox.Item
                    label="is Contracted"
                    status={contracted ? "checked" : "unchecked"}
                    onPress={() => setContracted(!contracted)}
                  />
                  <View style={styles.spacing} />
                  <Button title="Submit" onPress={handleSubmit} />
                  <View style={styles.spacing} />
                </View>
              )}
            </Formik>
          </KeyboardWrapper>
        </View>
      </Modal>
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  header: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: fonts.m,
  },
  scroll: {
    flex: 0.8,
    flexGrow: 0.8,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 10,
    margin: 10,
    padding: 10,
  },
  text: {
    fontSize: fonts.xs,
    marginBottom: 4,
  },
  postModalContainer: {
    position: "absolute",
    width: "100%",
    height: "88%",
    backgroundColor: "white",
    flex: 0.8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    bottom: 0,
    borderRadius: 13,
  },
  spacing: {
    marginBottom: 5,
  },
});
