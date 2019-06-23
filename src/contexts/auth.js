import React, { Component, createContext } from "react";
import createUseConsumer from "helpers/createUseConsumer";

import { auth, firestore } from "platform/Firebase/Firebase";

const Context = createContext();
const { Provider, Consumer: AuthConsumer } = Context;

class AuthProvider extends Component {
  state = {
    isLogined: false,
    currentUser: ""
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      this.actions.onAuthStateChanged(user);
    });
  }

  saveUser = user => {
    firestore
      .collection("userInfo")
      .doc(user.email)
      .get()
      .then(function(doc) {
        // save new user information
        if (doc.exists) {
        } else {
          // console.log('## saveUserData:', user)
          let userData = {
            userName: user.displayName,
            email: user.email,
            interface: {
              facebook: null,
              google: null
            }
          };

          firestore
            .collection("userInfo")
            .doc(user.email)
            .set(userData)
            .then(docRef => {
              console.log("user inforamation updated.");
            })
            .catch(error => {
              console.error("Error: user information update failed", error);
            });
        }
      });
  };

  actions = {
    onAuthStateChanged: user => {
      if (user) {
        console.log("[auth]:", user.email);
        this.setState({
          isLogined: true,
          currentUser: user.email
        });
        this.saveUser(user);
      } else {
        this.setState({
          isLogined: false
        });
      }
    },
    signOut: () => {
      console.log("[Auth] Signed Out");
      auth
        .signOut()
        .then(() => {
          this.setState({ isLogined: false, currentUser: "" });
        })
        .catch(error => {
          console.error("Sign out error:", error);
        });
    }
  };
  render() {
    const { state, actions } = this;
    const value = { state, actions };
    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

const useAuth = createUseConsumer(AuthConsumer);

export { AuthProvider, AuthConsumer, useAuth };
