import React from "react";

import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Card,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core";

import { firestore } from "platform/Firebase/Firebase";

const conditionsDetail = {
  "<": "HIGH_THRESHOLD",
  "=": "NORMAL",
  ">": "LOW_THRESHOLD"
};

const InputText = props => {
  const { id, handleChange, value } = props;
  return (
    <TextField
      margin="dense"
      id={id}
      label={id}
      fullWidth
      onChange={handleChange(id)}
      value={value}
    />
  );
};

const InputSelect = props => {
  const { id, handleChange, value, list } = props;
  return (
    <TextField
      margin="dense"
      id={id}
      label={id}
      fullWidth
      onChange={handleChange(id)}
      select
      value={value}
      required
    >
      {list.map(item => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </TextField>
  );
};

const styles = theme => ({
  root: {
    width: "100%",
    padding: 20,
    overflowX: "auto"
  },
  text: {
    textAlign: "center",
    paddingTop: 15
  }
});

const settingList = ["name", "channel", "condition", "value", "action"];

class RuleSetting extends React.PureComponent {
  state = {
    // rule settings
    channels: [],
    conditions: ["<", "=", ">"],
    actions: ["SEND_EMAIL", "SEND_SMS", "DEVICE_CONFIG"],

    name: "",
    channel: "",
    condition: "",
    value: "",
    action: "",
    // when action is DEVICE_CONFIG
    targetSource: "",
    // TODO: taget config 구체화
    targetConfig: ""
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  valicationCheck = () => {
    const {
      name,
      channel,
      condition,
      value,
      action,
      targetSource,
      targetConfig
    } = this.state;

    if (
      name === "" ||
      channel === "" ||
      condition === "" ||
      value === "" ||
      action === ""
    ) {
      return false;
    } else if (
      action === "DEVICE_CONFIG" &&
      (targetSource === "" || targetConfig === "")
    ) {
      return false;
    } else {
      return true;
    }
  };

  handleSubmit = async () => {
    const { dataSource } = this.props;
    const {
      name,
      channel,
      condition,
      value,
      action,
      targetSource,
      targetConfig
    } = this.state;

    if (!this.valicationCheck()) {
      alert("Please fill the rule configurations.");
    } else {
      var newRule = {
        displayName: name,
        channel: channel,
        condition: conditionsDetail[condition],
        threshold: value,
        event: {
          context: {
            config: {
              binaryData: targetConfig,
              versionToUpdate: 0
            }
          },
          eventType: action,
          targetSourceId: targetSource
        }
      };

      try {
        const docSnapshot = await firestore
          .collection("dataSource")
          .doc(dataSource)
          .get();

        var rules = docSnapshot.data().rules;
        firestore
          .collection("dataSource")
          .doc(dataSource)
          .set({ rules: rules.concat(newRule) }, { merge: true })
          .then(doc => {
            alert("new rule updated!");
          })
          .catch(error => {
            console.log("Device data save error =>", error);
          });
      } catch (err) {
        console.log("<RuleSetting> error:", err);
      }
    }
  };

  render() {
    const { channels, sourceList, classes } = this.props;
    const { action, targetSource, targetConfig } = this.state;

    // console.log("<RuleSetting> render()");

    return (
      <Card style={{ padding: 20 }}>
        <h3>Rule Definition</h3>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Grid container spacing={1}>
              {settingList.map((rule, index) =>
                rule === "name" || rule === "value" ? (
                  <Grid item xs key={index}>
                    <InputText
                      id={rule}
                      handleChange={this.handleChange}
                      value={this.state[rule]}
                    />
                  </Grid>
                ) : (
                  <Grid item xs key={index}>
                    <InputSelect
                      id={rule}
                      handleChange={this.handleChange}
                      list={
                        rule === "channel" ? channels : this.state[rule + "s"]
                      }
                      value={this.state[rule]}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
          <Grid item xs={2}>
            {action === "DEVICE_CONFIG" ? (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <InputSelect
                    id={"targetSource"}
                    handleChange={this.handleChange}
                    list={sourceList}
                    value={targetSource}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputText
                    id={"targetConfig"}
                    handleChange={this.handleChange}
                    value={targetConfig}
                  />
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            {this.state.channel !== "" ? (
              <Typography variant="subtitle1" className={classes.text}>
                {"If " +
                  this.state.channel +
                  " " +
                  this.state.condition +
                  " " +
                  this.state.value +
                  ", " +
                  this.state.action}
              </Typography>
            ) : null}
          </Grid>
          <Grid item xs={2}>
            <Button
              style={{ padding: 10 }}
              size="large"
              onClick={this.handleSubmit}
              color="primary"
            >
              Add new rule
            </Button>
          </Grid>
        </Grid>
      </Card>
    );
  }
}

export default withStyles(styles)(RuleSetting);
