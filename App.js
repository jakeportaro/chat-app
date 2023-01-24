import React from "react";
import Start from "./components/Start";
import Chat from "./components/Chat";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CustomActions from './components/CustomActions';

const Stack = createStackNavigator();

class App extends React.Component {
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
