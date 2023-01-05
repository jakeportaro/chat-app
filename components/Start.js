import { React, Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ImageBackground,
} from "react-native";
import Image from "./Image.png";

export default class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
  }

  render() {
    return (
      <ImageBackground source={Image} resizeMode="cover" style={styles.image}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <TextInput
            style={styles.input}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            placeholder="Enter your name here..."
            placeholderTextColor={"black"}
          />
          <Button
            title="Go to Chat Room"
            onPress={() =>
              this.props.navigation.navigate("Chat", { name: this.state.name })
            }
            style={styles.button}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    color: "white",
    fontSize: 20,
    padding: 10,
    borderWidth: 2,
  },

  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 2,
    minWidth: 200,
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },
});
