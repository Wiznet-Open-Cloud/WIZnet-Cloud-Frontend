import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import BarChartIcon from "@material-ui/icons/BarChart";
import PieChartIcon from "@material-ui/icons/PieChart";
import TitleIcon from "@material-ui/icons/Title";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";

import { useTab } from "contexts/dashboardContext";

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(1),
    float: "right"
  }
}));

const ChartItems = props => {
  const { handleClick } = props;
  return (
    <List>
      <ListItem button onClick={() => handleClick("combo")}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        Chart: Line/Bar/Area/Scatter
      </ListItem>
      <ListItem button onClick={() => handleClick("gauge")}>
        <ListItemIcon>
          <PieChartIcon />
        </ListItemIcon>
        Gauge
      </ListItem>
      <ListItem button onClick={() => handleClick("text")}>
        <ListItemIcon>
          <TitleIcon />
        </ListItemIcon>
        Show Text
      </ListItem>
      <hr />
      <ListItem button onClick={() => handleClick("input")}>
        <ListItemIcon>
          <TextFieldsIcon />
        </ListItemIcon>
        Send Text (to Device)
      </ListItem>
      <ListItem button onClick={() => handleClick("switch")}>
        <ListItemIcon>
          <ToggleOnIcon />
        </ListItemIcon>
        On/Off Switch
      </ListItem>
    </List>
  );
};

const AddGridButton = props => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const { name, addGrid, gridsLen } = props;

  const handleClick = menu => {
    setOpen(false);

    let newIndex = 0;
    //! check index rule
    if (gridsLen === 0) {
      newIndex = 0;
    } else {
      newIndex = gridsLen;
    }
    addGrid(menu, newIndex);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} className={classes.button}>
        {name}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="menu-dialog-title"
      >
        <DialogTitle id="menu-dialog-title">Which type of widget?</DialogTitle>
        <ChartItems handleClick={handleClick} />
      </Dialog>
    </div>
  );
};

AddGridButton.defaultProps = {
  name: "Add Widget"
};

export default useTab(({ actions }) => ({
  addGrid: actions.addGrid
}))(AddGridButton);
