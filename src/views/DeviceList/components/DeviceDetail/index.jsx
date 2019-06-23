import React from "react";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Dialog
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 350
  },
  image: {
    height: 240,
    width: 240
  },
  root: {
    // backgroundColor: "rgba(0,0,0,0.9)"
  },
  paper: {
    // backgroundColor: "rgba(0,0,0,0.9)",
    boxShadow: "none",
    overflow: "hidden"
  }
}));

const DeviceDetail = props => {
  const classes = useStyles();
  const { open, onClose, devices, images, index } = props;

  // console.log("<DeviceDetail> props", props);

  const handleChange = name => event => {
    console.log("handleChange", name, event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      PaperProps={{
        classes: {
          root: classes.paper
        }
      }}
    >
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={
            images.hasOwnProperty(devices[index].dataSourceType)
              ? images[devices[index].dataSourceType]
              : images["default"]
          }
          title="Default Image"
        />
        <CardContent>
          <TextField
            id="textField"
            label="Serial Number"
            margin="normal"
            defaultValue={devices[index].displayName}
            onChange={handleChange}
          />
          <Typography variant="body2" gutterBottom>
            DeviceType
          </Typography>
          <Typography align="center" variant="body1" gutterBottom>
            {devices[index].dataSourceType}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Product Number
          </Typography>
          <Typography align="center" variant="body1" gutterBottom>
            {devices[index].dataSourceId}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Created Time
          </Typography>
          <Typography align="center" variant="body1" gutterBottom>
            {new Date(devices[index].createdAt.seconds * 1000).toLocaleString(
              "en-GB",
              {
                timeZone: "Asia/Seoul",
                timeZoneName: "short"
              }
            )}
          </Typography>
        </CardContent>
        <div align="right">
          <Button style={{ fontSize: 13 }} onClick={onClose}>
            CANCLE
          </Button>
          <Button style={{ fontSize: 13 }} onClick={onClose}>
            SAVE
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default DeviceDetail;
