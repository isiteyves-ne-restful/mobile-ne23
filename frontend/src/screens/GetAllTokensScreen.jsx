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

// Get All Tokens Screen
const GetAllTokensScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokensFetched, setTokensFetched] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [resultMeter, setResultMeter] = useState("");

  const initialValues = {
    meter_number: "",
  };

  const validationSchema = Yup.object().shape({
    meter_number: Yup.string()
      .required("Meter number is required")
      .min(6, "Meter number must be at least 6 characters")
      .max(6, "Meter number must be at most 6 characters")
      .test("is-integer", "Meter number must be a valid integer", (value) =>
        Number.isInteger(Number(value))
      ),
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
      // Make API request to get tokens for the specified meter number
      // Use values.meter_number to get the meter number input value
      const response = await sendRequest(
        `${API_URL}/${values?.meter_number}`,
        "GET",
        {}
      );

      // Handle the response accordingly
      // if (response?.data?.status === 200) {
      console.log("igisubizo ni iki: ", response.data);
      setTokens(response?.data?.data);
      setResultMeter(values?.meter_number);
      setTokensFetched(true);
      // }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("ikosa aha...", error, error?.response);
      return setError(
        error?.response?.data?.message ||
          "An error occurred while fetching tokens"
      );
    }
  };

  const isFieldEmpty = values.meter_number.trim().length === 0;
  return (
    <View style={tw`h-[100%] bg-white justify-end items-center`}>
      <SafeAreaView style={tw`h-[85%] w-full bg-white`}>
        <ScrollView>
          <View>
            <View style={tw`w-full`}>
              <Text
                style={[
                  styles.textBold,
                  tw`text-[#2272C3] font-bold text-2xl text-center`,
                ]}
              >
                Get All Tokens
              </Text>
              <Text
                style={[styles.text, tw`text-[#b5b4b3] text-center text-xl`]}
              >
                Enter the Meter Number
              </Text>
            </View>

            {error.length > 0 && (
              <Text style={[styles.text, tw`mt-4 text-red-500 text-center`]}>
                {error}
              </Text>
            )}
            <View style={tw`mt-8`}>
              <View style={tw`px-6 py-2`}>
                <View style={tw`py-2`}>
                  <Input
                    Icon={<Feather name="hash" size={24} color="silver" />}
                    placeholder="Meter Number"
                    onChangeText={handleChange("meter_number")}
                    onBlur={handleBlur("meter_number")}
                    value={values.meter_number}
                    borderColor={
                      touched.meter_number && errors.meter_number
                        ? "red"
                        : "gray"
                    }
                  />
                  {touched.meter_number && errors.meter_number && (
                    <Text style={tw`text-red-500`}>{errors.meter_number}</Text>
                  )}
                </View>

                <View style={tw`mt-8`}>
                  <Button
                    mode={"contained"}
                    style={[styles.text, tw`w-full p-[10] mt-4 text-2xl`]}
                    onPress={handleSubmit}
                    disabled={isFieldEmpty || loading || !formik.isValid}
                  >
                    {loading ? "Fetching Tokens..." : "Get Tokens"}
                  </Button>

                  {tokensFetched && (
                    <View style={tw`mt-4`}>
                      <Text
                        style={[
                          styles.text,
                          tw`text-base underline text-gray-500`,
                        ]}
                      >
                        Tokens for meter: {resultMeter}
                      </Text>
                      {tokens.map(
                        (
                          {
                            id,
                            token,
                            amount,
                            token_status,
                            token_value_days,
                            purchased_date,
                          },
                          index
                        ) => (
                          <View
                            key={index}
                            style={tw`mt-4 border border-gray-300 p-4`}
                          >
                            <Text
                              style={[
                                styles.text,
                                tw`text-base text-gray-500 font-bold`,
                              ]}
                            >
                              {index + 1}
                              {"\n"}
                              ====================
                            </Text>
                            <Text
                              style={[styles.text, tw`text-base text-gray-500`]}
                            >
                              Token: {token}
                            </Text>
                            <Text
                              style={[styles.text, tw`text-base text-gray-500`]}
                            >
                              Amount: {amount}
                            </Text>
                            <Text
                              style={[styles.text, tw`text-base text-gray-500`]}
                            >
                              Token Status: {token_status}
                            </Text>
                            <Text
                              style={[styles.text, tw`text-base text-gray-500`]}
                            >
                              Token Value Days: {token_value_days}
                            </Text>
                            <Text
                              style={[styles.text, tw`text-base text-gray-500`]}
                            >
                              Purchased Date: {purchased_date}
                            </Text>
                          </View>
                        )
                      )}
                      {tokens.length === 0 && (
                        <Text
                          style={[
                            styles.text,
                            tw`text-base text-gray-500 font-bold`,
                          ]}
                        >
                          No tokens for that meter
                        </Text>
                      )}
                    </View>
                  )}

                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={tw`mt-4`}>
                      <Text
                        style={[
                          styles.text,
                          tw`text-base underline text-gray-500`,
                        ]}
                      >
                        Go back
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Regular",
  },
  textBold: {
    fontFamily: "Poppins-Bold",
  },
});

export default GetAllTokensScreen;
