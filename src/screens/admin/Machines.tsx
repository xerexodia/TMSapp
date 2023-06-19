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
import { Entypo } from "@expo/vector-icons";

const Machines = () => {
  const navigation = useNavigation<any>();
  const [machines, setMachines] = useState<any>([]);

  const getMachines = async () => {
    return await axios.get(`${url}Machine/AllMachines`);
  };
  const deleteMachine = async (id: string) => {
    await axios.delete(`${url}Machine/${id}`);
    const filter = machines.filter((item: any) => item.serialNumber !== id);
    setMachines(filter);
  };
  console.log(machines);
  React.useEffect(() => {
    getMachines()
      .then((res) => {
        setMachines(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      setMachines([]);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Liste des machines</Text>
      </View>
      <ScrollView style={styles.scroll}>
        {machines ? (
          machines?.map((item: any, idx: number) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("UserMachines", { id: item.id })
              }
              key={idx}
              style={styles.card}
            >
              <Entypo
                name="trash"
                size={24}
                color="red"
                style={{
                  position: "absolute",
                  right: -5,
                  top: -5,
                  zIndex: 100,
                }}
                onPress={() => deleteMachine(item.serialNumber)}
              />
              <Text style={styles.text}>
                Numéro de séries: {item.serialNumber}
              </Text>
              <Text style={styles.text}>Machine type: {item.machineType}</Text>
              <Text style={styles.text}>Client id: {item.userId}</Text>
              <Text style={styles.text}>Date de vente: {item.sellDate}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No machines yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Machines;

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
    position: "relative",
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
