import React, { useState, createContext, useEffect, useContext } from "react";
import * as firebase from 'firebase';

export const UserContext = createContext({ user: null });

function UserProvider(props) {

  const [user, setUser] = useState([]);
  const [authUser, setAuthUser] = useState();


  firebase.auth().onAuthStateChanged((user) => {
    setAuthUser(user.uid);
  })
  useEffect(() => {
    var firebaseUser = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (firebaseUser != null) {
      name = firebaseUser.displayName;
      email = firebaseUser.email;
      photoUrl = firebaseUser.photoURL;
      emailVerified = firebaseUser.emailVerified;
      uid = firebaseUser.uid;
    }

    firebase.auth().currentUser.getIdToken(true).then(async function(idToken) {
      localStorage.setItem("@token", idToken)

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Authorization': 'Bearer ' + localStorage.getItem("@token") },
        body: JSON.stringify({ token: uid })
      };
      await fetch('https://europe-west1-plannerapp-960c1.cloudfunctions.net/app/api/get-user-data', requestOptions)
          .then(response => response.json())
          .then(data => setUser({ ...data, ['uid'] : uid  }));
    }).catch(function(error) {
      console.log(error);
    });
    
  }, []);

  return (
    <UserContext.Provider value={user}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserProvider;
