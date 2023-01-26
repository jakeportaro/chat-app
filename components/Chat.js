import React from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  SystemMessage,
} from "react-native-gifted-chat";
import CustomActions from "./CustomActions";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import MapView from "react-native-maps";

const firebase = require("firebase");
require("firebase/firestore");

// declare empty offline alert system message
let offlineAlert = {
  _id: 1,
  text: "",
  system: true,
};

// Chat component
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {},
      image: null,
      location: null,
      isConnected: false,
    };

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyA-2FxHetIu2-UbQ2X2mXXnREKcac2fF7A",
      authDomain: "test-e14ab.firebaseapp.com",
      projectId: "test-e14ab",
      storageBucket: "test-e14ab.appspot.com",
      messagingSenderId: "371306460083",
      appId: "1:371306460083:web:0e161c459cb5e71a5cd1c6",
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // set firestore reference messages
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    // set navigation title = username
    let name = this.props.route.params.username;
    this.props.navigation.setOptions({ title: name });

    // set firestore reference messages
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // check if online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        // authorize firebase
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            //update user state with currently active user data
            this.setState({
              messages: [],
              user: {
                _id: user.uid,
                name,
              },
              isConnected: true,
            });
            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        // update offline alert system message
        offlineAlert = {
          _id: 1,
          text: "You are currently offline. Messages can't be updated or sent.",
          system: true,
        };

        // get messages from local storage if not online
        this.getMessages();
        this.getUser();
        this.setState({ isConnected: false });
      }
    });
  }

  // unsuscribe
  componentWillUnmount() {
    if (this.state.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  // get messages from local AsyncStorage
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

  // get user from local AsyncStorage
  async getUser() {
    let user = "";
    try {
      user = (await AsyncStorage.getItem("user")) || [];
      this.setState({
        user: JSON.parse(user),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // save messages to local AsyncStorage
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

  // save user to local AsyncStorage
  async saveUser() {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(this.state.user));
    } catch (error) {
      console.log(error.message);
    }
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

  // add message to firestore
  addMessage = (message) => {
    this.referenceChatMessages.add({
      _id: message[0]._id,
      createdAt: message[0].createdAt,
      text: message[0].text || "",
      user: {
        _id: this.state.user._id,
        name: this.props.route.params.username,
      },
      image: message[0].image || null,
      location: message[0].location || null,
    });
  };

  // send message => append to messages array
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        // callback: after saving state, add and save messages + user
        this.addMessage(messages);
        this.saveMessages();
        this.saveUser();
      }
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#fff",
          },
          right: {
            // customize active user bubble color
            backgroundColor: this.props.route.params.color,
          },
        }}
      />
    );
  }

  // don't render input bar when offline
  renderInputToolbar(props) {
    if (!this.state.isConnected) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  // custom system message when offline
  renderSystemMessage(props) {
    if (!this.state.isConnected) {
      return <SystemMessage {...props} textStyle={styles.systemMessage} />;
    } else {
    }
  }

  //  display communication features
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //custom map view
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
      <ActionSheetProvider>
        <View style={[styles.container]}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderSystemMessage={this.renderSystemMessage.bind(this)}
            renderActions={this.renderCustomActions}
            renderCustomView={this.renderCustomView}
            // if offline, append offlineAlert message before message array
            messages={
              this.state.isConnected
                ? this.state.messages
                : [offlineAlert, ...this.state.messages]
            }
            // messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: this.state.user._id,
            }}
          />
          {Platform.OS === "android" && (
            <KeyboardAvoidingView behavior="height" />
          )}
        </View>
      </ActionSheetProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
  },
  systemMessage: {
    color: "red",
  },
});
