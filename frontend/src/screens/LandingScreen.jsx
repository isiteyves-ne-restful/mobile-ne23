import React from "react";
import { Text, SafeAreaView, View, TouchableOpacity } from "react-native";
import tw from "twrnc";
// Landing Screen
const LandingScreen = ({ navigation }) => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Text style={tw`text-2xl font-bold mb-8`}>Welcome to EUCL</Text>
      <TouchableOpacity
        style={tw`bg-blue-500 py-2 px-4 rounded-md mb-4`}
        onPress={() => navigation.navigate("BuyElectricityScreen")}
      >
        <Text style={tw`text-white`}>Buy Electricity</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`bg-blue-500 py-2 px-4 rounded-md mb-4`}
        onPress={() => navigation.navigate("ValidateTokenScreen")}
      >
        <Text style={tw`text-white`}>Validate Token</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`bg-blue-500 py-2 px-4 rounded-md`}
        onPress={() => navigation.navigate("GetAllTokensScreen")}
      >
        <Text style={tw`text-white`}>Get All Tokens</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LandingScreen;
