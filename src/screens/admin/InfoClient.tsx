import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../utils/contants";
import { ScrollView } from "react-native-gesture-handler";
import { colors } from "../../utils/generalStyles";
import Button from "../../components/Button";
import KeyboardWrapper from "../../components/KeyBoardWrapper";
import { Formik } from "formik";
import Modal from "react-native-modal";
import Input from "../../components/Input";
import * as DocumentPicker from "expo-document-picker";

const InfoClient = () => {
  const [requestData, setRequestData] = useState([]);
  const [show, setShow] = useState(false);
  const [file, setFile] = useState("");
  const pickDocument = async () => {
    let result = (await DocumentPicker.getDocumentAsync({})) as any;
    setFile(result?.uri);
  };
  const fetchRequestData = async () => {
    try {
      const response = await axios.get(`${url}Request/AllRequests`);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching request data:", error);
    }
  };

  const Reply = async (values: any, id: any) => {
    const formData = new FormData();
    const blob = {
      uri: file,
      type: "application/pdf",
      name: "file",
    } as unknown as Blob;
    formData.append("attachment", blob);
    formData.append("clientRequestId", id);
    formData.append("response", values.Message);
    const data = await axios.post(`${url}Response/AddResponse`, formData, {
      headers: {
        "Content-Type": "multipart/form-data; ",
      },
    });
  };
  useEffect(() => {
    fetchRequestData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 22 }}>Info Client</Text>
      </View>
      <ScrollView style={{ flex: 0.8, flexGrow: 0.8 }}>
        {requestData?.length > 0 ? (
          requestData?.map((item: any, idx: number) => (
            <View
              key={idx}
              style={{
                backgroundColor: "white",
                borderRadius: 13,
                marginHorizontal: 10,
                marginVertical: 10,
                elevation: 10,
                padding: 10,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}
                >
                  user Name: {item?.user?.userName}{" "}
                </Text>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}
                >
                  Type de reclamation: {item?.requestType}{" "}
                </Text>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}
                >
                  Date de reclamation: {item?.creationDate.split("T")[0]}{" "}
                </Text>
                <Text
                  style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}
                >
                  Description: {item?.fullDescription}
                </Text>
                {item.attachment && (
                  <Text>Attachment: {item?.attachmentName}</Text>
                )}
                <TouchableOpacity
                  onPress={() => setShow(true)}
                  style={{
                    alignSelf: "center",
                    marginVertical: 10,
                    backgroundColor: colors.brand,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>Reply</Text>
                </TouchableOpacity>
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
                          Message: "",
                        }}
                        onSubmit={async (values) => {
                          Reply(values, item.id);
                          setShow(false);
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

                            <Button
                              title="Ajouter fichier"
                              onPress={pickDocument}
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
            </View>
          ))
        ) : (
          <Text>No request yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default InfoClient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
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
  spacing: {
    marginBottom: 25,
  },
});
