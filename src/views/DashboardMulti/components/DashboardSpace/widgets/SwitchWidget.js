import React, { useState, useEffect } from "react";

import { Typography, Switch, Grid, FormGroup } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { firestore } from "platform/Firebase/Firebase";

const SwitchWidget = props => {
  const [swValue, setSwValue] = useState(false);
  const [swDisable, setSwDisable] = useState(true);

  const { settings } = props;

  useEffect(() => {
    if (settings.dataSource.length > 0) {
      setSwDisable(false);
    } else {
      setSwDisable(true);
    }
  }, [settings.dataSource.length]);

  useEffect(() => {
    // console.log("Effect #2", swDisable, swValue);
    if (!swDisable) {
      addActionEvent(swValue);
    }
  }, [swValue]);

  const addActionEvent = async value => {
    const dataSource = settings.dataSource;

    const docSnapshot = await firestore
      .collection("dataSource")
      .doc(dataSource)
      .get();
    const sourceType = docSnapshot.data().dataSourceType;

    let jsonStr = JSON.stringify({
      value: value
    });
    let actionData = {
      context: {
        config: {
          binaryData: jsonStr,
          versionToUpdate: ""
        }
      },
      dataSourceId: dataSource,
      dataSourceTypeId: sourceType,
      createdAt: new Date(),
      eventType: "DEVICE_CONFIG"
    };
    console.log("<SwitchWidget> actionData:", actionData);

    try {
      await firestore
        .collection("actionEvents")
        .doc()
        .set(actionData);
      console.log("Event updated!");
      // alert("Switch value updated!");
    } catch (err) {
      console.log("Text event update failed: ", err);
    }
  };

  return (
    <FormGroup>
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>Off</Grid>
          <Grid item>
            <AntSwitch
              checked={swValue}
              disabled={swDisable}
              onChange={e => setSwValue(e.target.checked)}
              value="switch"
            />
          </Grid>
          <Grid item>On</Grid>
        </Grid>
      </Typography>
    </FormGroup>
  );
};

const AntSwitch = withStyles(theme => ({
  root: {
    width: 28 * 2,
    height: 16 * 2,
    padding: 0,
    display: "flex"
  },
  switchBase: {
    padding: 2 * 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(24px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main
      }
    }
  },
  thumb: {
    width: 12 * 2,
    height: 12 * 2,
    boxShadow: "none"
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white
  },
  checked: {}
}))(Switch);

export default SwitchWidget;
