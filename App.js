import React from 'react';
import { View } from 'react-native';
import AddEntry from './components/AddEntry';
import History from './components/History';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from './reducers';

const store = createStore(Reducer);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store} style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={{ height: 20 }} />
          <History />
        </View>
      </Provider>
    );
  }
}