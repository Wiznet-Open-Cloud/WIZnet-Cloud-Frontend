import React, { useState } from "react";
import { withStyles } from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { compose } from "recompose";
import { useTab } from "contexts/dashboardContext";

const styles = theme => ({
  root: {
    padding: "5px 15px"
  }
});

const WidgetMenu = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { classes, index, removeGrid, onGridMenuClick } = props;

  const onRemove = () => {
    setAnchorEl(null);
    removeGrid(index);
  };

  const onMenuClick = () => {
    setAnchorEl(null);
    onGridMenuClick(index);
  };

  return (
    <div>
      <IconButton
        aria-label="More"
        aria-haspopup="true"
        onClick={e => setAnchorEl(e.currentTarget)}
        className={classes.root}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={onMenuClick}>Edit</MenuItem>
        <MenuItem onClick={onRemove}>Remove this</MenuItem>
      </Menu>
    </div>
  );
};

export default compose(
  withStyles(styles),
  useTab(({ actions }) => ({
    removeGrid: actions.removeGrid,
    onGridMenuClick: actions.onGridMenuClick
  }))
)(WidgetMenu);
