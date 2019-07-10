import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";
import classNames from "classnames";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import { Divider, Typography } from "@material-ui/core";

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4),
    bottom: "0",
    right: "0",
    position: "fixed",
    textAlign: "right",
    width: "100%"
    // borderTop: "1px solid #E7E7E7"
  },
  company: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1) * 0.5
  }
});

class Footer extends Component {
  render() {
    const { classes, className } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <Divider />
        <Typography className={classes.company} variant="subtitle2">
          &copy; WIZnet Co., Ltd. 2019
        </Typography>
        {/* <Typography variant="caption">
          Created with love for the environment. By designers and developers who
          love to work together in offices!
        </Typography> */}
      </div>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
