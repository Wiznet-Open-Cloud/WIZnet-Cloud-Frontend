import React, { useState } from "react";

import {
  Button,
  List,
  ListItem,
  DialogTitle,
  Dialog,
  ListItemIcon
} from "@material-ui/core";

import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Title as TitleIcon,
  TextFields as TextFieldsIcon,
  ToggleOn as ToggleOnIcon
} from "@material-ui/icons";

import { useTab } from "contexts/dashboardContext";

const widgets = [
  {
    name: "combo",
    icon: <BarChartIcon />,
    label: "Chart: Line/Bar/Area/Scatter"
  },
  { name: "gauge", icon: <PieChartIcon />, label: "Gauge" },
  { name: "text", icon: <TitleIcon />, label: "Show Text" },
  { name: "input", icon: <TextFieldsIcon />, label: "Send Text (to Device)" },
  { name: "switch", icon: <ToggleOnIcon />, label: "On/Off Switch" }
];

const AddWidgetButton = props => {
  const [open, setOpen] = useState(false);
  const { name, addGrid, gridsLen, classes } = props;

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
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        className={classes.button}
      >
        {name}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="widget-type-select"
      >
        <DialogTitle id="widget-type-select">Which type of widget?</DialogTitle>
        <List>
          {widgets.map(item => (
            <ListItem button onClick={() => handleClick(item.name)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {item.label}
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
};

AddWidgetButton.defaultProps = {
  name: "Add Widget"
};

export default useTab(({ actions }) => ({
  addGrid: actions.addGrid
}))(AddWidgetButton);
