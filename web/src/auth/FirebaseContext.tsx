import React from "react";
import app from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

interface FirebaseClass {
  createUser: Function;
}

class Firebase implements FirebaseClass {
  constructor() {
    app.initializeApp(config);
    // @ts-ignore
    this.auth = app.auth();
  }
  createUser = (email: string, password: string) => {
    // @ts-ignore
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  signIn = (email: string, password: string) => {
    // @ts-ignore

    return this.auth.signInWithEmailAndPassword(email, password);
  };

  signOut = () => {
    // @ts-ignore
    return this.auth.signout();
  };

  // @ts-ignore
  resetPassword = (email: string) => this.auth.sendPasswordResetEmail(email);

  // @ts-ignore
  updatePassword = (password: string) => this.auth.updatePassword(password);
}

export default Firebase;


export const FirebaseContext = React.createContext(null);
