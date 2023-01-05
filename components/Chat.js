import React from "react";
import { View, Text, Button } from 'react-native';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = { backgroundColor: 'white' };
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color
    this.props.navigation.setOptions({ title: name, backgroundColor: color });
  };


  render() {
    return (
      <View style={{flex: 1, backgroundColor: this.state.backgroundColor}}>
         <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, height: 50 }}>
        {colors.map(color => (
          <Button
          key={color}
          title={color}
          onPress={() => this.setState({ backgroundColor: color })}
          color="black"
          buttonStyle={{ backgroundColor: color, borderColor: color, borderRadius: 50, borderWidth: 2 }}
        />
        ))}
        </View>
      </View>
    );
  }
}
