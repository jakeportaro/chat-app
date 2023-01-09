import React from "react";
import { View, Text, Button } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: this.props.route.params.color,
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: "You've entered the chat",
          createdAt: new Date(),
          system: true,
         },
      ],
    });
    
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: name, backgroundColor: color });
  };

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.state.backgroundColor }}>
        <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}
