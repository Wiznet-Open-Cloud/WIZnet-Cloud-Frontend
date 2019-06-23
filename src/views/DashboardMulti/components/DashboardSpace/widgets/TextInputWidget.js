import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { firestore } from "platform/Firebase/Firebase";

import { compose } from "recompose";

const styles = theme => ({
  button: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginTop: "10px"
  }
});

const TextInputWidget = props => {
  const [text, setText] = useState("");
  const [buttonDisable, setButtonDisable] = useState(true);

  const { settings, classes } = props;

  useEffect(() => {
    if (settings.dataSource.length > 0) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [settings.dataSource]);

  const handleSave = async () => {
    console.log("<TextInputWidget> handleSave()", text);
    const dataSource = settings.dataSource;

    if (text.length > 0) {
      const docSnapshot = await firestore
        .collection("dataSource")
        .doc(dataSource)
        .get();
      const sourceType = docSnapshot.data().dataSourceType;

      let jsonStr = JSON.stringify({
        text: text
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

      console.log("<TextInputWidget> actionData:", actionData);

      // ! .add(...) === .doc().set(...)
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
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          // autoFocus
          margin="dense"
          id="text"
          label="Input Text"
          fullWidth
          onChange={e => setText(e.target.value)}
          value={text}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          disabled={buttonDisable}
          onClick={handleSave}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Send
        </Button>
      </Grid>
    </Grid>
  );
};

export default compose(withStyles(styles))(TextInputWidget);
