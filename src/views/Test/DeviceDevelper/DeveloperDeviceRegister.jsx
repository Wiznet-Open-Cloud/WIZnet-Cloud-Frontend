import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  InputAdornment
} from "@material-ui/core";

import { auth, firestore } from "platform/Firebase/Firebase";

const DB_COLLECTION = "deviceData";
// const DB_COLLECTION = "dataSource";

const DeveloperDeviceRegister = props => {
  const classes = useStyles();
  const { open, handleClose } = props;

  const [values, setValues] = useState({
    macAddress: "",
    deviceGroup: "",
    company: "wiznet",
    deviceName: ""
  });
  const [owner, setOwner] = useState("");

  useEffect(() => {
    getUserInfo();
  });

  const getUserInfo = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setOwner(user.email);
      } else {
        setOwner("");
      }
    });
  };

  const handleChange = name => event => {
    // console.log("handleChange()", name, event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = () => {
    // console.log("<DeveloperDeviceRegister> handleSave");
    handleClose();

    const mac =
      values.company === "wiznet"
        ? "00:08:dc:" + values.macAddress
        : values.macAddress;

    //! mac address verify
    const regexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
    if (!regexp.test(mac)) {
      alert("Invalid Mac address.");
      return;
    }

    const sourceData = {
      dataSourceType: values.deviceGroup,
      displayName: values.deviceName,
      owner: "",
      createdAt: new Date(),
      state: "",
      rules: [],
      options: "",
      developer: owner,
      deviceId: mac,
      spec: {
        analog: null,
        digital: null
      },
      authenticatedAt: null,
      isAuthenticated: false
    };
    console.log("<DeveloperDeviceRegister> handleSave", sourceData);

    try {
      firestore
        .collection(DB_COLLECTION)
        .doc(values.deviceName)
        .get()
        .then(doc => {
          if (doc.exists) {
            console.log("Document already exist:", doc.data());
          } else {
            firestore
              .collection(DB_COLLECTION)
              .doc(values.deviceName)
              .set(sourceData)
              .then(() => {
                console.log("New dataSource added!", sourceData);
                alert(`New Device added: ${values.deviceName}`);
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
    } catch (err) {
      console.log("<DeveloperDeviceRegister>", err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="developer-device-register-form"
    >
      <DialogTitle
        id="developer-device-register-form"
        className={classes.title}
      >
        Register device
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Register developed device.</DialogContentText>
        <FormGroup className={classes.container}>
          <FormControl component="fieldset" className={classes.textField}>
            <FormLabel component="legend">Company</FormLabel>
            <RadioGroup
              aria-label="Company"
              name="company"
              className={classes.group}
              value={values.company}
              onChange={handleChange("company")}
              row
            >
              <FormControlLabel
                value="wiznet"
                control={<Radio />}
                label="WIZnet"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
          {values.company === "wiznet" ? (
            <TextField
              label="Device mac address (WIZnet)"
              id="simple-start-adornment"
              className={classes.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">00:08:DC:</InputAdornment>
                )
              }}
              onChange={handleChange("macAddress")}
            />
          ) : (
            <TextField
              label="Device mac address (Other)"
              id="device-mac"
              className={classes.textField}
              value={values.macAddress}
              onChange={handleChange("macAddress")}
              margin="normal"
            />
          )}
          <TextField
            label="Device Name: [device group]+[number]"
            id="device-name"
            className={classes.textField}
            value={values.deviceName}
            onChange={handleChange("deviceName")}
            margin="normal"
          />
          <TextField
            label="Device group (use lowercase)"
            id="device-group"
            className={classes.textField}
            value={values.deviceGroup}
            onChange={handleChange("deviceGroup")}
            margin="normal"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
          className={classes.button}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" className={classes.button}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: 300
  },
  textField: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    width: 280
  },
  group: {
    margin: theme.spacing(1, 0)
  },
  button: {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  title: {
    marginTop: theme.spacing(2),
    fontSize: 24
  }
}));

export default DeveloperDeviceRegister;
