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

// Buy Electricity Screen
const BuyElectricityScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [boughtToken, setBoughtToken] = useState("");
  const [boughtSuccessfully, setBoughtSuccessfully] = useState(false);

  const initialValues = {
    meter_number: "",
    amount: "",
  };

  const validationSchema = Yup.object().shape({
    meter_number: Yup.string()
      .required("Meter number is required")
      .min(6, "Meter number must be at least 6 characters")
      .max(6, "Meter number must be at most 6 characters")
      .test("is-integer", "Meter number must be a valid integer", (value) =>
        Number.isInteger(Number(value))
      ),
    amount: Yup.number()
      .required("Amount is required")
      .max(182500, "Amount must be less than or equal to 182500")
      .integer("Amount must be an integer")
      .test(
        "is-multiple-of-100",
        "Amount must be a multiple of 100",
        (value) => value % 100 === 0
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    formik;

  const handleBuyElectricity = async () => {
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
      // Make the API request to buy electricity
      // Use values.meter_number and values.amount
      const response = await sendRequest(API_URL + "/generate", "POST", {
        meter_number: values.meter_number,
        amount: parseInt(values.amount),
      });

      if (response?.data?.status === 200) {
        setLoading(false);
        // Handle success
        setBoughtSuccessfully(true);
        // reset formik form values
        formik.resetForm();
        console.log("igisubizo...", response?.data);
        setBoughtToken(response?.data?.data?.token);
      } else {
        setLoading(false);
        console.log("igisubizo...", response.data);
        setError(
          response?.data?.message || "Error occurred while buying electricity"
        );
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("ikosa...", error, values);
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Text style={tw`text-2xl font-bold mb-8`}>Buy Electricity</Text>
      {error.length > 0 && <Text style={tw`text-red-500 mb-4`}>{error}</Text>}
      <Input
        Icon={<Feather name="user" size={24} color="silver" />}
        placeholder="Meter Number"
        value={values.meter_number}
        onChangeText={handleChange("meter_number")}
        onBlur={handleBlur("meter_number")}
        borderColor={
          touched.meter_number && errors.meter_number ? "red" : "gray"
        }
      />
      {touched.meter_number && errors.meter_number && (
        <Text style={tw`text-red-500 mb-2`}>{errors.meter_number}</Text>
      )}
      <Input
        Icon={<Feather name="dollar-sign" size={24} color="silver" />}
        placeholder="Amount"
        value={values.amount}
        onChangeText={handleChange("amount")}
        onBlur={handleBlur("amount")}
        borderColor={touched.amount && errors.amount ? "red" : "gray"}
      />
      {touched.amount && errors.amount && (
        <Text style={tw`text-red-500 mb-2`}>{errors.amount}</Text>
      )}
      <Button
        mode="contained"
        style={tw`mt-8`}
        onPress={handleBuyElectricity}
        disabled={loading}
      >
        {loading ? "Buying..." : "Buy"}
      </Button>
      {boughtSuccessfully && (
        <Text style={tw`text-green-500 mt-4`}>
          Electricity bought successfully! Token: {boughtToken}
        </Text>
      )}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={tw`text-blue-500 mt-4`}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BuyElectricityScreen;
