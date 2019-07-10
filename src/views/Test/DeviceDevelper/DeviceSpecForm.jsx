import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  FormGroup,
  FormControl,
  FormLabel
  // Grid
} from "@material-ui/core";

// const specType = ["analog", "digital"];

const DeviceSpecForm = props => {
  const classes = useStyles();

  const [values, setValues] = useState({
    numberOfChannel: 2
  });

  const handleChange = name => event => {
    // console.log("handleChange()", name, event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };

  // channel 수 선택 -> 입력한 수 만큼 폼 생김.
  return (
    <FormGroup className={classes.container}>
      <FormControl className={classes.textField}>
        <FormLabel>Number of Channels</FormLabel>
        <TextField
          // label="Device mac address (WIZnet)"
          id="number-of-channel"
          // className={classes.textField}
          onChange={handleChange("numberOfChannel")}
          value={values.numberOfChannel}
        />
      </FormControl>
    </FormGroup>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: 400
  },
  textField: {
    margin: theme.spacing(1),
    width: 370
  },
  group: {
    margin: theme.spacing(1, 0)
  }
}));

export default DeviceSpecForm;
