import React, { useState } from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const chartTypes = ["Line", "Bar", "Area"];

const styles = theme => ({
  textfield: {
    width: "100%",
    marginTop: theme.spacing(1)
  }
});

const ChartFormPart = props => {
  const [chartType, setChartType] = useState("");

  const { classes } = props;
  return (
    <div>
      <TextField
        select
        margin="dense"
        id="chartType"
        label="chartType"
        onChange={e => setChartType(e.target.value)}
        value={chartType}
        className={classes.textfield}
      >
        {chartTypes.map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default withStyles(styles)(ChartFormPart);
