import React from 'react';
import { View } from 'react-native';
import AddEntry from './components/AddEntry';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from './reducers';

const store = createStore(Reducer);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View>
          <AddEntry />
        </View>
      </Provider>
    );
  }
}