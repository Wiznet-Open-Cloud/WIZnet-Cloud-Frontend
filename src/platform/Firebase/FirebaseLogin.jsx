import React from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import { firebase, auth, firestore } from "./Firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Redirect } from "react-router-dom";

class FirebaseLogin extends React.Component {
  state = {
    isLogined: false,
    userEmail: null,
    loading: true
  };

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  componentDidMount() {
    // Listen to the Firebase Auth state and set the local state.
    this.unregisterAuthObserver = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          isLogined: true,
          userEmail: user.email,
          loading: false
        });
        this.saveUser(user);
      } else {
        this.setState({ isLogined: false, userEmail: null, loading: false });
      }
      console.log("<FirebaseLogin> user", user);
      this.setState({ isLogined: !!user });
    });
  }

  saveUser = user => {
    try {
      firestore
        .collection("userInfo")
        .doc(user.email)
        .get()
        .then(function(doc) {
          // save new user information
          if (doc.exists) {
          } else {
            console.log("## saveUser:", user);
            // const provider = [];
            // user.providerData.forEach(profile => {
            //   provider.push(profile);
            // });

            var userData = {
              userName: user.displayName,
              email: user.email,
              interface: {
                facebook: null,
                google: null,
                github: null
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
    } catch (err) {
      console.error("<FirebaseLogin> saveUser error:", err);
    }
  };

  // Configure FirebaseUI.
  uiConfig = {
    signInSuccessUrl: "/",
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        scopes: ["public_profile", "email"]
      },
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true
      }
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  render() {
    const { loading, isLogined, userEmail } = this.state;

    if (loading) {
      return <CircularProgress />;
    } else {
      // if (!isLogined) {
      //   return <Redirect to="/" />;
      // }
    }
    return (
      <div>
        {isLogined ? (
          <div>
            <h4>Welcome, {userEmail}!</h4>
            <Redirect to="/" />
          </div>
        ) : (
          <div>
            <Typography variant="h4">Sign in with below options.</Typography>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth} />
          </div>
        )}
      </div>
    );
  }
}

export default FirebaseLogin;
