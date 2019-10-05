import React, { useState, useEffect } from "react";
import app from "firebase/app";
import "firebase/auth";

// auth methods can be found here: https://firebase.google.com/docs/reference/js/firebase.auth.Auth

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

// interface FirebaseClass {
//   createUser: Function;
// }

// class Firebase implements FirebaseClass {
//   constructor() {
//     app.initializeApp(config);
//     // @ts-ignore
//     this.auth = app.auth();
//   }
//   createUser = (email: string, password: string) => {
//     // @ts-ignore
//     return this.auth.createUserWithEmailAndPassword(email, password);
//   };

//   signIn = (email: string, password: string) => {
//     // @ts-ignore

//     return this.auth.signInWithEmailAndPassword(email, password);
//   };

//   signOut = () => {
//     // @ts-ignore
//     return this.auth.signout();
//   };

//   // @ts-ignore
//   resetPassword = (email: string) => this.auth.sendPasswordResetEmail(email);

//   // @ts-ignore
//   updatePassword = (password: string) => this.auth.updatePassword(password);

//   onAuthStateChanged = (callback: any) => {
//       // @ts-ignore
//     this.auth.onAuthStateChanged(callback)
//   }
// }

// Need only one instance per firebase, otherwise will run into multiple app initializations
// https://stackoverflow.com/questions/37557491/firebase-app-named-default-already-exists-google-firebase-reference-does-n
const initializedFirebase = app.initializeApp(config).auth();

export const FirebaseContext = React.createContext({
  firebase: null,
  user: null
});

export const FirebaseProvider = (props: {}) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userSubscription = initializedFirebase.onAuthStateChanged(
      (user: any) => {
        user ? setUser(user) : setUser(null);
      }
    );
    return userSubscription;
  }, []);

  const value = React.useMemo(() => {
    return {
      firebase: initializedFirebase,
      user,
      setUser
    };
  }, [user]);
  // @ts-ignore
  return <FirebaseContext.Provider value={value} {...props} />;
};
