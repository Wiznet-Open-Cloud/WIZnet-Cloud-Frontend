import React, { useState } from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  textfield: {
    width: "100%",
    marginTop: theme.spacing(1)
  }
});

const GaugeFormPart = props => {
  const [values, setValues] = useState({
    unit: "",
    min: 0,
    max: 100
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const { classes } = props;
  return (
    <div>
      <TextField
        margin="dense"
        id="min"
        label="Min value"
        onChange={handleChange("min")}
        type="number"
        value={values.minValue}
        className={classes.textfield}
      />
      <TextField
        margin="dense"
        id="max"
        label="Max value"
        onChange={handleChange("max")}
        type="number"
        value={values.maxValue}
        className={classes.textfield}
      />
      <TextField
        margin="dense"
        id="unit"
        label="Unit"
        onChange={handleChange("unit")}
        value={values.unit}
        className={classes.textfield}
      />
    </div>
  );
};

export default withStyles(styles)(GaugeFormPart);
