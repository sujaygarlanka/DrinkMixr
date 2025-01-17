/**
 * @format
 */

import * as React from 'react';
import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './app/reducers/reducer';
import thunk from 'redux-thunk';

const store = createStore(reducer, applyMiddleware(thunk));

export default function Main() {
    return (
      <Provider store={store}>
        <App />
        
      </Provider>
    );
  }

AppRegistry.registerComponent(appName, () => Main);
