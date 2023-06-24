import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, fonts } from "../../utils/generalStyles";
import axios from "axios";
import { url } from "../../utils/contants";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import Input from "../../components/Input";
import Button from "../../components/Button";
import KeyboardWrapper from "../../components/KeyBoardWrapper";
import { Formik } from "formik";
import Modal from "react-native-modal";
import { Checkbox } from "react-native-paper";

const MachineDetails = (props: any) => {
  const id = props.route.params.id;
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>({});
  const [informerModal, setInformerModal] = useState(false);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [machine, setMachine] = useState<any>({});
  const [visits, setVisits] = useState<any>({});
  const [admin, setAdmin] = useState(false);
  const [contracted, setContracted] = useState(false);
  const [file, setFile] = useState("");
  const pickDocument = async () => {
    let result = (await DocumentPicker.getDocumentAsync({})) as any;
    setFile(result?.uri);
  };

  const deleteMachine = async () => {
    await axios.delete(`${url}Machine/${id}`);
    navigation.goBack();
  };

  const getMachine = async () => {
    return await axios.get(`${url}Machine/${id}/visits`);
  };

  const informer = async (values: any) => {
    const formData = new FormData();
    const blob = {
      uri: file,
      type: "application/pdf",
      name: "file",
    } as unknown as Blob;
    formData.append("Attachment", blob);
    formData.append("UserId", id);
    formData.append("Message", values.Message);
    const data = await axios.post(
      `${url}MessageToCLient/SendMessageToClient`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data; ",
        },
      }
    );
    console.log(formData);
  };
  useEffect(() => {
    getMachine()
      .then((res) => {
        setMachine(res.data), setVisits(res.data?.visitDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(machine);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Machine Details</Text>
      </View>
      <View style={styles.headerCard}>
        <View style={styles.boxContainer}>
          <View>
            <Text style={styles.text}>
              Numéro de série:: {machine.serialNumber}
            </Text>
            <Text style={styles.text}>id client: {machine.userId}</Text>
            <Text style={styles.text}>type: {machine.machineType}</Text>
            <Text style={styles.text}> date de vente: {machine.sellDate}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={deleteMachine}
            style={{
              backgroundColor: "red",
              borderRadius: 13,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontWeight: "500",
                color: "white",
              }}
            >
              Supprimer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setInformerModal(true)}
            style={{
              backgroundColor: "grey",
              borderRadius: 13,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text
              style={{
                fontWeight: "500",
                color: "white",
              }}
            >
              informer
            </Text>
          </TouchableOpacity>
          {/* informer modal */}
          <Modal
            style={{ margin: 0 }}
            isVisible={informerModal}
            onBackdropPress={() => setInformerModal(false)}
            backdropOpacity={0.1}
            swipeDirection={"down"}
            scrollHorizontal={true}
            avoidKeyboard={true}
            onSwipeComplete={() => setInformerModal(false)}
          >
            <View style={styles.postModalContainer}>
              <KeyboardWrapper>
                <Formik
                  initialValues={{
                    Message: "",
                  }}
                  onSubmit={async (values) => {
                    informer(values);
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
                        label="Message:"
                        onBlur={() => setFieldTouched("Message")}
                        onChangeText={handleChange("Message")}
                        placeholder="message"
                        error={
                          touched.Message && errors.Message
                            ? errors.Message
                            : null
                        }
                        value={values.Message}
                      />
                      <View style={styles.spacing} />

                      <Button title="Ajouter fichier" onPress={pickDocument} />
                      <View style={styles.spacing} />
                      <Button title="Informer" onPress={handleSubmit} />
                      <View style={styles.spacing} />
                    </View>
                  )}
                </Formik>
              </KeyboardWrapper>
            </View>
          </Modal>
        </View>
      </View>
      <View style={{ flex: 0.7, paddingTop: 20 }}>
        <View
          style={{
            flex: 0.1,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text style={[styles.title]}>Liste des Visites</Text>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={{
              backgroundColor: colors.brand,
              borderRadius: 13,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontWeight: "500", color: "white" }}>Ajouter</Text>
          </TouchableOpacity>
          {/* add machine modal*/}
          <Modal
            style={{ margin: 0 }}
            isVisible={open}
            onBackdropPress={() => setOpen(false)}
            backdropOpacity={0.1}
            swipeDirection={"down"}
            scrollHorizontal={true}
            avoidKeyboard={true}
            onSwipeComplete={() => setOpen(false)}
          >
            <View style={[styles.postModalContainer, { height: "60%" }]}>
              <KeyboardWrapper>
                <Formik
                  initialValues={{
                    serialNumber: "",
                    machineType: "",
                    sellDate: "",
                  }}
                  onSubmit={async (values) => {
                    try {
                      const data = await axios.post(
                        `${url}Machine/AddMachine`,
                        {
                          id,
                          ...values,
                        }
                      );
                      if (data) {
                        setVisits((prev: any) => [...prev, data.data]);
                        setOpen(false);
                      }
                    } catch (error) {
                      console.log(error);
                    }
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
                        label="serialNumber:"
                        onBlur={() => setFieldTouched("serialNumber")}
                        onChangeText={handleChange("serialNumber")}
                        placeholder="serialNumber"
                        error={
                          touched.serialNumber && errors.serialNumber
                            ? errors.serialNumber
                            : null
                        }
                        value={values.serialNumber}
                      />
                      <View style={styles.spacing} />
                      <Input
                        label="machineType:"
                        onBlur={() => setFieldTouched("machineType")}
                        onChangeText={handleChange("machineType")}
                        placeholder="machineType"
                        error={
                          touched.machineType && errors.machineType
                            ? errors.machineType
                            : null
                        }
                        value={values.machineType}
                      />
                      <View style={styles.spacing} />
                      <Input
                        label="sellDate:"
                        onBlur={() => setFieldTouched("sellDate")}
                        onChangeText={handleChange("sellDate")}
                        placeholder="sellDate"
                        error={
                          touched.sellDate && errors.sellDate
                            ? errors.sellDate
                            : null
                        }
                        value={values.sellDate}
                      />
                      <View style={styles.spacing} />

                      <Button title="Informer" onPress={handleSubmit} />
                      <View style={styles.spacing} />
                    </View>
                  )}
                </Formik>
              </KeyboardWrapper>
            </View>
          </Modal>
        </View>
        <ScrollView
          style={{ flex: 0.9, paddingTop: 10 }}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {visits?.length > 0 ? (
            visits?.map((item: any, idx: number) => (
              <TouchableOpacity
                // onPress={() =>
                //   navigation.navigate("MachineDetails", {
                //     id: item.serialNumber,
                //   })
                // }
                key={idx}
                style={styles.card}
              >
                <Text style={styles.text}>id: {item.id}</Text>
                <Text style={styles.text}>final state: {item.finalState}</Text>
                <Text style={styles.text}>
                  repaire type: {item.repaireType}
                </Text>
                <Text style={styles.text}>visit date: {item.visitDate}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No visits yet</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default MachineDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  header: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  title: {
    fontSize: fonts.m,
  },
  headerCard: {
    flex: 0.2,
    flexGrow: 0.2,
    backgroundColor: "white",
    elevation: 10,
    padding: 10,
    borderRadius: 13,
    marginTop: 17,
  },
  boxContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  text: {
    fontSize: fonts.xs,
    marginBottom: 4,
  },
  buttons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  postModalContainer: {
    position: "absolute",
    width: "100%",
    height: "40%",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 8,
    bottom: 0,
    borderRadius: 13,
    marginTop: 30,
  },
  postModalContainer2: {
    position: "absolute",
    width: "100%",
    height: "88%",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 8,
    bottom: 0,
    borderRadius: 13,
  },
  spacing: {
    marginBottom: 25,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 10,
    margin: 10,
    padding: 10,
  },
});
