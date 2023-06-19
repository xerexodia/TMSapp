import { StyleSheet, Text, TextInputProps, View } from "react-native";
import React, { useState } from "react";
import { ErrorText, Label, colors, fonts } from "../utils/generalStyles";
import { TextInput } from "react-native-gesture-handler";

interface Props extends TextInputProps {
  label?: string;
  icon?: JSX.Element;
  onBlur?: () => void;
  error?: string | null;
  isPassword?: boolean;
}

const Input: React.FC<Props> = ({ label, error, icon, onBlur, ...rest }) => {
  const [borderColor, setBorderColor] = useState<string>(colors.grey);
  return (
    <View style={styles.container}>
      {/* input label */}
      <Label>{label}</Label>
      <View
        style={[
          styles.inputContainer,
          { borderColor: error ? colors.red : borderColor },
        ]}
      >
        {/* input left icon */}
        <View style={styles.leftIcon}>{icon ? icon : null}</View>
        {/* input field*/}
        <TextInput
          style={styles.input}
          {...rest}
          onFocus={() => {
            setBorderColor(colors.dark);
          }}
          onBlur={() => {
            setBorderColor(colors.grey);
            onBlur?.();
          }}
        />
        {/* input right icon */}
      </View>
      {/* input error */}
      <View style={styles.error}>
        {error ? <ErrorText>{error}</ErrorText> : null}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: { position: "relative" },
  inputContainer: {
    position: "relative",
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 50,
    overflow: "hidden",
    borderRadius: 4,
    borderWidth: 1,
  },
  input: {
    fontSize: fonts.m,
    paddingVertical: 13,
  },
  leftIcon: {
    position: "absolute",
    zIndex: 10,
    left: 17,
    top: 12,
  },
  rightIcon: {
    position: "absolute",
    zIndex: 10,
    right: 17,
    top: 12,
  },
  error: {
    position: "absolute",
    bottom: -18,
  },
});
