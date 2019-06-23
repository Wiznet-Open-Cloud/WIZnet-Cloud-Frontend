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
  MenuItem,
  Switch,
  FormGroup,
  FormControlLabel
} from "@material-ui/core";

import styles from "./styles";

const DeviceForm = props => {
  const [typeList, setTypeList] = useState([]);
  // user input
  const [values, setValues] = useState({
    deviceName: "",
    deviceType: " ",
    proxy: ""
  });

  // auto filled
  const [owner, setOwner] = useState("");

  const { classes, open, handleClose } = props;

  useEffect(() => {
    getUserInfo();
  });

  useEffect(() => {
    getTypeList();
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeProxy = name => event => {
    setValues({ ...values, [name]: event.target.checked });
  };

  const getUserInfo = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setOwner(user.email);
      } else {
        setOwner("");
      }
    });
  };

  const getTypeList = () => {
    let types = [];

    firestore
      .collection("dataSourceType")
      .get()
      .then(query => {
        query.forEach(doc => {
          types.push(doc.id);
        });
        setTypeList(types);
      });
  };

  const handleSave = () => {
    props.handleClose();

    let sourceData = {
      dataSourceType: values.deviceType,
      dataSourceId: values.deviceName,
      displayName: values.deviceName,
      owner: owner,
      createdAt: new Date(),
      state: "",
      rules: [],
      options: ""
    };

    if (values.proxy) {
      sourceData["mqttProxy"] = {
        host: "mqtts://mqtt.wiznet.io",
        password: "1duddjrhdqn!",
        username: "wizsen-proxyToMqtt"
      };
    }

    firestore
      .collection("dataSource")
      .doc(values.deviceName)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("Document already exist:", doc.data());
        } else {
          firestore
            .collection("dataSource")
            .doc(values.deviceName)
            .set(sourceData)
            .then(() => {
              console.log("New dataSource added!", sourceData);
              alert("New device added:", values.deviceName);
              setOwner("");
            })
            .catch(error => {
              console.error(
                "Error writing new device to Firebase Database",
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
      <DialogTitle id="form-dialog-title">Add Device</DialogTitle>
      <DialogContent>
        <DialogContentText>Add your device.</DialogContentText>
        <FormGroup className={classes.container}>
          <TextField
            label="Datasource Name"
            id="device-name"
            className={classes.textField}
            value={values.deviceName}
            onChange={handleChange("deviceName")}
            margin="normal"
          />
          <TextField
            id="device-type"
            select
            label="Device Type(Group)"
            className={classes.textField}
            value={values.deviceType}
            onChange={handleChange("deviceType")}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            helperText="Select your device type"
            margin="normal"
          >
            {typeList.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Switch
                label="Use Proxy Server"
                checked={values.proxy}
                onChange={handleChangeProxy("proxy")}
                value="proxy"
                className={classes.switch}
              />
            }
            label="Use Proxy Server"
            labelPlacement="end"
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

DeviceForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DeviceForm);
