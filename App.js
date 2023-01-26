import React from 'react';
import 'react-native-gesture-handler';
import Navigation from './components/Navigation';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navigation></Navigation>
    );
  }
}