import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";

// Shared layouts
import { Dashboard as DashboardLayout } from "layouts";
import ChartTest from "./ChartTest";
import WidgetFormPage from "./FormComponent/WidgetFormPage";

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(1) * 4
  },
  item: {
    height: "100%"
  }
});

const DashboardSingle = props => {
  const { classes } = props;

  return (
    <DashboardLayout title="Dashboard">
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item lg={12} md={12} xl={9} xs={12}>
            <WidgetFormPage />
          </Grid>

          <Grid item lg={12} md={12} xl={9} xs={12}>
            Single Dashboard
            <ChartTest />
          </Grid>
        </Grid>
      </div>
    </DashboardLayout>
  );
};

DashboardSingle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DashboardSingle);
