import React from "react";
import { View, Text, Button } from 'react-native';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { backgroundColor: this.props.route.params.color };
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color
    this.props.navigation.setOptions({ title: name, backgroundColor: color });
  };


  render() {
    return (
      <View style={{flex: 1, backgroundColor: this.state.backgroundColor}}>
         <Text>Welcome to the Chat!</Text> 
      </View>
    );
  }
}
