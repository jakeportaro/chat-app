import React from "react";
import { View, Text } from "react-native";

export default class Chat extends React.Component {
  componentDidMount() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
  }

  render() {
    return <View>{/* Rest of the UI */}</View>;
  }
}
