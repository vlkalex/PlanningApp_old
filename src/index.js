import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Register from './login/Register';
import Login from './login/Login';
import MainProvider from './providers/MainProvider';
import * as serviceWorker from './serviceWorker';
import moment from 'moment';
import 'moment/locale/sk';
import 'moment/locale/fr'

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "",
  authDomain: "plannerapp-960c1.firebaseapp.com",
  databaseURL: "https://plannerapp-960c1.firebaseio.com",
  projectId: "plannerapp-960c1",
  storageBucket: "plannerapp-960c1.appspot.com",
  messagingSenderId: "58980743581",
  appId: "1:58980743581:web:48f9f868a574b19dda5774"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    ReactDOM.render(
      <MainProvider>
        <App />
      </MainProvider>,
      document.getElementById('root')
    );

  } else {
    fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/logout')
          .then(response => response);
    ReactDOM.render(
      <Login />,
      document.getElementById('root')
    );
    // User is signed out
    // ...
  }
});

export const AuthContext = React.createContext(null);

moment.locale('sk');

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
