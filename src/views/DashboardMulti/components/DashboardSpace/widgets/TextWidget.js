import React from "react";

import { compose } from "recompose";

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import isJson from "helpers/isJson";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(1) * 1,
    // text align: center
    width: "100%",
    textAlign: "center"
  }
});

const TextWidget = props => {
  const { settings, data, classes } = props;

  const convertData = () => {
    let value = 0;

    const sourceChannel = settings.channel;

    if (data !== null) {
      if (sourceChannel !== "") {
        if (isJson(data.data)) {
          let jsonData = JSON.parse(data.data);

          // value = jsonData[sourceChannel];
          // add units
          value = jsonData[sourceChannel] + " " + settings.units;
        }
      }
      return value;
    } else {
      return "";
    }
    // console.log("<TextWidget> convertData()", value);
  };

  return (
    <Typography className={classes.root} variant="h1">
      {convertData()}
    </Typography>
  );
};

export default compose(withStyles(styles))(TextWidget);
