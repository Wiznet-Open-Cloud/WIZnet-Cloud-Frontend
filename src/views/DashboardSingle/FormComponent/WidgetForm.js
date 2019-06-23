import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent
} from "@material-ui/core";

import GaugeFormPart from "./GaugeFormPart";
import ChartFormPart from "./ChartFormPart";

import { firestore } from "platform/Firebase/Firebase";
import isJson from "helpers/isJson";

const widgetType = ["chart", "gauge", "text", "input", "switch"];

const useStyles = makeStyles(theme => ({
  textfield: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  container: {
    width: 350,
    padding: 25
  }
}));

const WidgetForm = props => {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    name: "",
    type: "",
    dataSource: "",
    channel: [],
    //
    isSourceChanged: false,
    channelList: []
  });

  const { sourceList, formOpen, handleClose } = props;

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeSource = name => event => {
    let channels = [];
    /* 마지막 events 데이터로부터 가져옴 */
    firestore
      .collection("dataSource")
      .doc(event.target.value)
      .collection("events")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then(query => {
        // events로 받은 데이터의 key 추출
        query.forEach(doc => {
          // console.log("get sourceName from EVENTS", doc.data().data);
          let rawData = doc.data().data;
          if (isJson(rawData)) {
            let jsonData = JSON.parse(rawData);
            channels = Object.keys(jsonData);
            setValues({
              ...values,
              isSourceChanged: true,
              channelList: channels,
              [name]: event.target.value
            });
          } else {
            alert("There is no data from Device.");
          }
        });
      });
  };

  return (
    <Dialog open={formOpen} onClose={handleClose}>
      <DialogTitle id="form-dialog-title">Widget configuration</DialogTitle>
      <DialogContent className={classes.container}>
        <TextField
          select
          margin="none"
          id="type"
          label="Type"
          onChange={handleChange("type")}
          value={values.type}
          className={classes.textfield}
        >
          {widgetType.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        {values.type !== "" ? (
          <div>
            <TextField
              margin="none"
              id="name"
              label="Name"
              onChange={handleChange("name")}
              value={values.name}
              className={classes.textfield}
            />
            <TextField
              select
              margin="none"
              id="dataSource"
              label="dataSource"
              onChange={handleChangeSource("dataSource")}
              value={values.dataSource}
              className={classes.textfield}
            >
              {sourceList.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </div>
        ) : null}

        {(values.type === "gauge" ||
          values.type === "chart" ||
          values.type === "text") &&
        values.isSourceChanged ? (
          <TextField
            select
            margin="none"
            id="channel"
            label="channel"
            onChange={handleChange("channel")}
            value={values.channel}
            className={classes.textfield}
          >
            {values.channelList.map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        {values.type === "gauge" ? <GaugeFormPart /> : null}
        {values.type === "chart" ? <ChartFormPart /> : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WidgetForm;
