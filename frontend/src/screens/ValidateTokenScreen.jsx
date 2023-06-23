import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import tw from "twrnc";

import Button from "../components/button";
import Input from "../components/input";
import API_URL, { sendRequest } from "../config/api";

// Validate Token Screen
const ValidateTokenScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [error, setError] = useState("");

  const initialValues = {
    token: "",
  };

  const validationSchema = Yup.object().shape({
    token: Yup.string().required("Token is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
  });

  const { handleChange, handleBlur, values, errors, touched, resetForm } =
    formik;

  const handleSubmit = async () => {
    try {
      const isValid = await validationSchema.isValid(values);
      if (!isValid) {
        try {
          validationSchema.validateSync(values, { abortEarly: false });
        } catch (errors) {
          const fieldErrors = {};
          errors.inner.forEach((error) => {
            fieldErrors[error.path] = error.message;
          });
          formik.setErrors(fieldErrors);
          return;
        }
      }
      setLoading(true);
      setError("");

      // Send the token validation request to the server
      const response = await sendRequest(
        `${API_URL}/validate/${values.token}`,
        "GET",
        {}
      );

      // log the response
      console.log("igisubizo ngiki...", response.data);

      // Handle the response accordingly
      if (response?.data?.status === 200) {
        // Token validation successful
        setDaysRemaining(response.data?.data?.days);
        setLoading(false);
        resetForm();
        // Perform any additional actions or navigate to another screen
      } else {
        // Token validation failed
        setLoading(false);
        setError(response?.data?.message || "Token validation failed");
      }
    } catch (error) {
      setLoading(false);
      console.log("ikosa hano rirafashwe...", error);
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  const isTokenEmpty = !values.token;

  return (
    <View style={tw`flex-1 bg-white justify-center items-center`}>
      <Text style={[styles.text, tw`text-2xl font-bold mb-4`]}>
        Validate Token
      </Text>

      {error.length > 0 && (
        <Text style={[styles.text, tw`text-red-500 mb-4`]}>{error}</Text>
      )}

      <View style={tw`w-3/4`}>
        <Input
          Icon={<Feather name="key" size={24} color="silver" />}
          placeholder="Enter token"
          value={values.token}
          onChangeText={handleChange("token")}
          onBlur={handleBlur("token")}
          borderColor={touched.token && errors.token ? "red" : "gray"}
        />
        {touched.token && errors.token && (
          <Text style={[styles.text, tw`text-red-500 mb-4`]}>
            {errors.token}
          </Text>
        )}

        <Button
          mode="contained"
          style={[styles.button, tw`mt-8`]}
          onPress={handleSubmit}
          disabled={isTokenEmpty || loading || !formik.isValid}
        >
          {loading ? "Validating..." : "Validate Token"}
        </Button>
        {daysRemaining && (
          <Text style={tw`text-green-500 mt-4`}>
            Token validated successfully! Days remaining: {daysRemaining}
          </Text>
        )}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={tw`text-blue-500 mt-4`}>Go back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Regular",
  },
  button: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
  },
});

export default ValidateTokenScreen;
