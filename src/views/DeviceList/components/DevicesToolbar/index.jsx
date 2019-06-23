import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";
import classNames from "classnames";

import { withStyles, Typography } from "@material-ui/core";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";

// Shared components
// import { DisplayMode, SearchInput } from "components";

// Component styles
import styles from "./styles";
import DeviceForm from "../DeviceForm";
import DeviceGroupForm from "../DeviceGroupForm";

const AlertDialog = props => {
  const { open, handleClose, handleClickOk } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-device-delete">
        {"Warning: Delete device?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Typography variant="subtitle1">
            선택된 장치를 정말 삭제하시겠습니까? <br />
            장치로부터 수집된 모든 데이터도 함께 삭제됩니다.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClickOk} color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

class DevicesToolbar extends Component {
  state = {
    deviceFormOpen: false,
    alertDialogOpen: false,
    deviceGroupFormOpen: false
  };

  handleClick = () => {
    this.setState({ deviceFormOpen: true });
  };

  handleClickAddType = () => {
    this.setState({ deviceGroupFormOpen: true });
  };

  handleClose = () => {
    this.setState({
      deviceFormOpen: false,
      alertDialogOpen: false,
      deviceGroupFormOpen: false
    });
  };

  handleClickOk = () => {
    this.setState({ alertDialogOpen: false });
    // delete device
    this.props.handleDelete();
  };

  handleClickDelete = () => {
    this.setState({ alertDialogOpen: true });
  };

  render() {
    const { classes, className, selectedDevices } = this.props;
    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <div className={classes.row}>
          <span className={classes.spacer} />
          {selectedDevices.length > 0 && (
            <IconButton
              className={classes.deleteButton}
              onClick={this.handleClickDelete}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <Button
            color="primary"
            size="small"
            variant="outlined"
            onClick={this.handleClick}
            className={classes.addButton}
          >
            Add
          </Button>
          <Button
            // color="second"
            size="small"
            variant="outlined"
            onClick={this.handleClickAddType}
            className={classes.addButton}
          >
            Add Device Type
          </Button>
          <AlertDialog
            open={this.state.alertDialogOpen}
            handleClickOk={this.handleClickOk}
            handleClose={this.handleClose}
          />
          <DeviceForm
            open={this.state.deviceFormOpen}
            handleClose={this.handleClose}
          />
          <DeviceGroupForm
            open={this.state.deviceGroupFormOpen}
            handleClose={this.handleClose}
          />
        </div>
        {/* <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            placeholder="Search user"
          />
          <span className={classes.spacer} />
          <DisplayMode mode="list" />
        </div> */}
      </div>
    );
  }
}

DevicesToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  selectedDevices: PropTypes.array
};

DevicesToolbar.defaultProps = {
  selectedDevices: []
};

export default withStyles(styles)(DevicesToolbar);
