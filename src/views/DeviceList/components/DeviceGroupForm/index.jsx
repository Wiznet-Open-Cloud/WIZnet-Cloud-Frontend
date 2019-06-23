import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { auth, firestore } from "platform/Firebase/Firebase";

import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup
} from "@material-ui/core";

import styles from "./styles";

const DeviceGroupForm = props => {
  const [values, setValues] = useState({
    groupName: ""
  });

  const { classes, open, handleClose } = props;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    props.handleClose();

    let deviceTypeData = {
      channels: [],
      configs: [],
      displayName: values.groupName,
      menufacturer: "WIZnet",
      type: "device"
    };

    firestore
      .collection("dataSourceType")
      .doc(values.groupName)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("Document already exist:", doc.data());
          alert("This devcie type already exist.");
        } else {
          firestore
            .collection("dataSourceType")
            .doc(values.groupName)
            .set(deviceTypeData)
            .then(() => {
              console.log("New dataSourceType added!", deviceTypeData);
              alert("New device type added!");
            })
            .catch(error => {
              console.error(
                "Error writing new dataSourceType to Firebase Database",
                error
              );
            });
        }
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add DeviceType</DialogTitle>
      <DialogContent>
        <DialogContentText>Add new device type.</DialogContentText>
        <FormGroup className={classes.container}>
          <TextField
            label="Device Type Name"
            id="type-name"
            className={classes.textField}
            value={values.groupName}
            onChange={handleChange("groupName")}
            margin="normal"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeviceGroupForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DeviceGroupForm);
