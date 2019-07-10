import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { compose } from "recompose";
import { useTab } from "contexts/dashboardContext";

import ResponsiveGridLayout from "./ResponsiveGridLayout";

const DashboardTab = props => {
  const { classes, tabs, currentTab, handleTabChange } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Tabs
          // className={classes.tabs}
          variant="scrollable"
          value={currentTab}
          onChange={handleTabChange}
        >
          {tabs.map(tab => (
            <Tab key={tab.index} label={tab.label} />
          ))}
        </Tabs>
      </AppBar>

      {tabs.map(
        (tab, index) =>
          currentTab === index && <ResponsiveGridLayout key={index} />
      )}
    </div>
  );
};

DashboardTab.propTypes = {
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "#f8fafc" //theme.palette.background.paper
    // position: 'absolute',
  },
  button: {
    flexGrow: 1,
    zIndex: 1,
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2)
  },
  tabs: {
    marginLeft: -12,
    marginRight: 20
  },
  appBar: {
    backgroundColor: "#303030"
  }
});

export default compose(
  withStyles(styles),
  useTab(({ state, actions }) => ({
    tabs: state.tabs,
    currentTab: state.currentTab,
    handleTabChange: actions.handleTabChange
  }))
)(DashboardTab);
