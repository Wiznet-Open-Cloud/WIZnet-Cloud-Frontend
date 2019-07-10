import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// Externals
import PropTypes from "prop-types";
import compose from "recompose/compose";

import { withStyles } from "@material-ui/core";
import {
  Grid,
  IconButton,
  // CircularProgress,
  Typography
} from "@material-ui/core";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";

import styles from "./styles";

import FirebaseLogin from "platform/Firebase/FirebaseLogin";

class SignIn extends Component {
  handleBack = () => {
    const { history } = this.props;

    history.goBack();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid className={classes.quoteWrapper} item lg={6}>
            <div className={classes.quote}>
              <div className={classes.quoteInner}>
                <Typography className={classes.quoteText} variant="h1">
                  {/* WIZnet Cloud */}
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid className={classes.content} item lg={6} xs={12}>
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <IconButton
                  className={classes.backButton}
                  onClick={this.handleBack}
                >
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography className={classes.title} variant="h2">
                    Sign in
                  </Typography>
                  {/* Firebase Sign-In */}
                  <FirebaseLogin />
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SignIn.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(SignIn);
