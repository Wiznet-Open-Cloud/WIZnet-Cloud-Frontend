import React, { useState, useEffect } from "react";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import SimpleSnackbar from "components/SimpleSnackbar";
import DashboardTab from "./DashboardTab";
import AddGridButton from "./AddGridButton";

import { compose } from "recompose";
import { useTab } from "contexts/dashboardContext";

import { auth, firestore } from "platform/Firebase/Firebase";
import FirestoreSnapshot from "platform/Firebase/FirestoreSnapshot";

const styles = theme => ({
  button: {
    marginRight: theme.spacing(1),
    float: "right"
  }
});

const DashboardSpace = props => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  const { addTab, removeTab, tabs, grids, loadTab, classes } = props;

  // Load user dashboard data
  useEffect(() => {
    if (userEmail === null) {
      getUserInfo();
    } else {
      if (!isLoaded) {
        loadUserData();
      }
    }
  });

  const getUserInfo = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("DashboardSpace auth >", user.email);
        setUserEmail(user.email);
      }
    });
  };

  const loadUserData = async () => {
    // load user dashboard
    try {
      if (true) {
        const docSnapshot = await firestore
          .collection("userInfo")
          .doc(userEmail)
          .get();

        if (docSnapshot.data().hasOwnProperty("configData")) {
          let configData = docSnapshot.data().configData.dashboard;
          if (configData !== undefined) {
            // console.log("<DashboardSpace> configData", configData);
            loadTab(configData);
            setIsLoaded(true);
            // console.log("<DashboardSpace> ###", configData);
          }
        } else {
          console.log("no Config Data");
        }
      }
    } catch (err) {
      console.log("<DashboardSpace> error", err);
    }
  };

  const handleSave = () => {
    let data = {
      dashboard: {
        tabs: tabs,
        grids: grids
      }
    };
    // console.log("<tab> handleSave():", userEmail, data);

    firestore
      .collection("userInfo")
      .doc(userEmail)
      .set({ configData: data }, { merge: true })
      .then(() => {
        console.log("<tab> handleSave() complete");
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.log("<tab> handleSave(): save failed!", error);
      });
  };

  return (
    <div>
      {isLoaded ? <FirestoreSnapshot /> : null}

      <Button onClick={handleSave} color="primary" className={classes.button}>
        Save
      </Button>
      <Button onClick={removeTab} color="secondary" className={classes.button}>
        Delete Tab
      </Button>
      <Button onClick={addTab} className={classes.button}>
        Add Tab
      </Button>

      <AddGridButton gridsLen={grids.length} />

      <SimpleSnackbar
        open={snackbarOpen}
        message="Current dashboard is saved successfully!"
        onClose={() => setSnackbarOpen(false)}
      />

      <DashboardTab {...props} />
    </div>
  );
};

export default compose(
  withStyles(styles),
  useTab(({ state, actions }) => ({
    tabs: state.tabs,
    grids: state.grids,
    addTab: actions.addTab,
    loadTab: actions.loadTab,
    removeTab: actions.removeTab
  }))
)(DashboardSpace);
