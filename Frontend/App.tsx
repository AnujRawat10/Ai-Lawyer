import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn";
import ChatApp from "./components/ChatApp";
const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='LandingPage'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name='LandingPage' component={LandingPage} />
          <Stack.Screen name='SignIn' component={SignIn} />
          <Stack.Screen name='ChatApp' component={ChatApp} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;