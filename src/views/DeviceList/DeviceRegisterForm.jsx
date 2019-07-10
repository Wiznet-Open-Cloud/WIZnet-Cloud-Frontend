import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  InputAdornment
} from "@material-ui/core";

import { firestore } from "platform/Firebase/Firebase";

const DB_COLLECTION = "deviceData";
// const DB_COLLECTION = "dataSource";

// TODO: add custom alert
// import DialogRegAlert from "./DialogRegAlert";

const DeviceRegisterForm = props => {
  const classes = useStyles();
  const { handleClose, currentUser, open } = props;

  const [values, setValues] = useState({
    macAddress: "",
    company: "wiznet"
  });

  const handleSave = () => {
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

    // Result types: Registration success / Already / Wrong (invalid mac)
    firestore
      .collection(DB_COLLECTION)
      .doc(mac)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log("user device register >>", doc.data());
          if (doc.data().owner !== "") {
            console.log("The device already registered!");
            alert(`The device [${doc.id}] is already registered!`);
          } else {
            firestore
              .collection(DB_COLLECTION)
              .doc(mac)
              .set({ owner: currentUser }, { merge: true })
              .then(() => {
                // TODO: Check device number
                alert("The Device registerd! :)");
                handleClose();
              })
              .catch(error => {
                console.log("Device data save error =>", error);
              });
          }
        } else {
          alert(`There is no [${doc.id}]!`);
        }
      });
  };

  const handleChange = name => event => {
    // console.log("handleChange()", name, event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="user-device-register-form"
    >
      <DialogTitle id="user-device-register-form">Device Number</DialogTitle>
      <DialogContent className={classes.container}>
        <DialogContentText>Type Device's MAC Address</DialogContentText>
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
            <FormControlLabel value="other" control={<Radio />} label="Other" />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          CANCEL
        </Button>
        <Button onClick={handleSave} color="primary">
          SAVE
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
    margin: theme.spacing(1),
    width: 270
  },
  group: {
    margin: theme.spacing(1, 0)
  }
}));

export default DeviceRegisterForm;
