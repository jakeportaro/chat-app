import React from "react";
import { View, Text, Button, Image } from "react-native";
import * as Location from "expo-location";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: this.props.route.params.color,
      messages: [],
      user: {},
      image: null,
      location: null,
      isConnected: false,
    };
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyA-2FxHetIu2-UbQ2X2mXXnREKcac2fF7A",
        authDomain: "test-e14ab.firebaseapp.com",
        projectId: "test-e14ab",
        storageBucket: "test-e14ab.appspot.com",
        messagingSenderId: "371306460083",
        appId: "1:371306460083:web:0e161c459cb5e71a5cd1c6",
      });
    }
    this.referenceMessagesUser = null;
    this.addMessage = this.addMessage.bind(this);
  }
  // retrieve snapshot of messages from firestore when changed
  onCollectionUpdate = (querySnapshot) => {
    if (!this.state.isConnected) return;
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({ messages });
  };

  // save message to Firestore
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || "",
      location: message.location || null,
    });
  };

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(messages = []) {
    const anotherUser = { _id: 2, name: 'Another User' };
    messages[0].user = anotherUser; // update user object here
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
      this.saveMessages();
      this.addMessage();
      }
      );
      }


  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  renderInputToolbar(props) {
    if (!this.state.isConnected) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  componentDidMount() {
    //checks if user in online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        console.log("online");
      } else {
        console.log("offline");
      }
    });
    //retrieves messages from asyncStorage
    this.getMessages();
    // creating a references to shoppinglists collection
    this.referenceMessages = firebase.firestore().collection("messages");

    let name = this.props.route.params.name;
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: name, backgroundColor: color });

    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user?.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
        }}
      />
    );
  }

  //  display communication features
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.state.backgroundColor }}>
        <GiftedChat
          //  renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ _id: 2}}
        />
      </View>
    );
  }
}
