import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Shared layouts
import { Dashboard as DashboardLayout } from "layouts";

// Custom components
import { DashboardSpace } from "./components";

// Context API
import { DashboardProvider } from "contexts/dashboardContext";

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  item: {
    height: "100%"
  }
});

class DashboardMulti extends Component {
  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Dashboard">
        <div className={classes.root}>
          <DashboardProvider>
            <DashboardSpace />
          </DashboardProvider>
        </div>
      </DashboardLayout>
    );
  }
}

DashboardMulti.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DashboardMulti);
