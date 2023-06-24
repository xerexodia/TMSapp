import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../../utils/generalStyles";
import { useAuthContext } from "../../context/AuthContext";
import axios from "axios";
import { url } from "../../utils/contants";
import Button from "../../components/Button";
import KeyboardWrapper from "../../components/KeyBoardWrapper";
import { Formik } from "formik";
import Input from "../../components/Input";
import * as DocumentPicker from "expo-document-picker";
import Modal from "react-native-modal";

const ContactAdmin = () => {
  const [show, setShow] = useState(false);
  const { user } = useAuthContext();
  const [requests, setRequests] = useState([]);
  const [index, setIndex] = useState<number | null | undefined>(null);
  const [id, setId] = useState("");
  const [response, setResponse] = useState<any>([]);
  const [file, setFile] = useState("");
  const pickDocument = async () => {
    let result = (await DocumentPicker.getDocumentAsync({})) as any;
    setFile(result?.uri);
  };
  // Fetch the user's requests
  const getRequests = async () => {
    try {
      const response = await axios.get(
        `${url}MyRequest/AllMyRequests/?clientId=${user.id}`
      );
      setRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const toggleResponses = async (requestId: any) => {
    try {
      setResponse([]);
      const response = await axios.get(
        `${url}MyResponse/MyResponses/${requestId}?clientId=${user.id}`
      );
      if (response.status === 200) {
        setResponse(response.data);
      } else {
        setResponse([]);
      }
    } catch (error) {
      // console.error("Error fetching responses:", error);
    }
  };

  const Contacter = async (values: any) => {
    const formData = new FormData();
    const blob = {
      uri: file,
      type: "application/pdf",
      name: "file",
    } as unknown as Blob;
    formData.append("userId", user.id); // Include the userId field
    formData.append("requestType", values.RequestType);
    formData.append("fullDescription", values.Message);
    formData.append("attachment", blob);

    try {
      const response = await axios.post(
        `${url}MyRequest/SendRequest?cleintId=${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data; ",
          },
        }
      );
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  useEffect(() => {
    getRequests();
  }, [user.id]);
  useEffect(() => {
    toggleResponses(id);
  }, [index]);
  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10 }}>
      <View
        style={{
          flex: 0.2,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 18 }}>Contacter Admin</Text>
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={{
            backgroundColor: colors.brand,
            borderRadius: 13,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text style={{ fontWeight: "500", color: "white" }}>Contacter</Text>
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
                    RequestType: "",
                  }}
                  onSubmit={async (values) => {
                    Contacter(values);
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
                        label="RequestType:"
                        onBlur={() => setFieldTouched("RequestType")}
                        onChangeText={handleChange("RequestType")}
                        placeholder="RequestType"
                        error={
                          touched.RequestType && errors.RequestType
                            ? errors.RequestType
                            : null
                        }
                        value={values.RequestType}
                      />
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
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 0.8, flexGrow: 0.8 }}>
        {requests?.length > 0 ? (
          requests?.map((item: any, idx: number) => (
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
                  onPress={() => {
                    setIndex(idx), setId(item.id);
                  }}
                  style={{
                    alignSelf: "center",
                    marginVertical: 10,
                    backgroundColor: colors.brand,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>show response</Text>
                </TouchableOpacity>
                {idx === index && response?.length > 0
                  ? response.map((item: any, idx: number) => (
                      <View key={idx}>
                        <Text>message: {item?.response}</Text>
                        <Text>Date: {item?.creationDate}</Text>
                        {item.attachment && (
                          <Text>Piece jointe: {item?.attachmentName}</Text>
                        )}
                      </View>
                    ))
                  : null}
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

export default ContactAdmin;

const styles = StyleSheet.create({
  postModalContainer: {
    position: "absolute",
    width: "100%",
    height: "50%",
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
