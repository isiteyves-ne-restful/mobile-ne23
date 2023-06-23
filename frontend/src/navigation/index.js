import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "../screens/LandingScreen";
import BuyElectricityScreen from "../screens/BuyElectricity";
import ValidateTokenScreen from "../screens/ValidateTokenScreen";
import GetAllTokensScreen from "../screens/GetAllTokensScreen";

export default function Navigator() {
  return <AppNavigation />;
}

export function AppNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="LandingScreen">
      <Stack.Screen
        name="LandingScreen"
        component={LandingScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BuyElectricityScreen"
        component={BuyElectricityScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ValidateTokenScreen"
        component={ValidateTokenScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="GetAllTokensScreen"
        component={GetAllTokensScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
