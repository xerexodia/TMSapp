import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
} from "react-native";
import React from "react";
import { colors, fonts } from "../utils/generalStyles";

interface Props extends TouchableOpacityProps {
  title?: string;
  onPress?: any;
}

const Button: React.FC<Props> = ({ onPress, title, ...rest }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} {...rest}>
      <Text style={styles.textButton}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    width: "auto",
  },
  textButton: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: fonts.m,
    letterSpacing: 0.7,
  },
});
