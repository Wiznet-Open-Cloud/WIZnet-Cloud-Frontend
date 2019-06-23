import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Button, Snackbar, IconButton, Slide } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  close: {
    padding: theme.spacing(1) / 2
  }
});

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const SimpleSnackbar = props => {
  const { classes, message, open, onClose } = props;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      open={open}
      TransitionComponent={SlideTransition}
      autoHideDuration={3000}
      onClose={onClose}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <Button key="undo" color="secondary" size="small" onClick={onClose}>
          OK
        </Button>,
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
};

SimpleSnackbar.defaultProps = {
  message: "Alarm"
};

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleSnackbar);
