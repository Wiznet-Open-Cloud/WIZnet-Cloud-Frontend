import React, { Component } from "react";
import { Link, NavLink, Redirect } from "react-router-dom";

// Externals
import classNames from "classnames";
import PropTypes from "prop-types";

// Material helpers
import { withStyles, CircularProgress } from "@material-ui/core";

// Material components
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography
} from "@material-ui/core";

// Material icons
import {
  DashboardOutlined as DashboardIcon,
  ShoppingBasketOutlined as ShoppingBasketIcon,
  InfoOutlined as InfoIcon,
  DeviceHubOutlined as DeviceIcon,
  StyleOutlined as RulesIcon
} from "@material-ui/icons";

// Component styles
import styles from "./styles";

import { auth } from "platform/Firebase/Firebase";

class Sidebar extends Component {
  state = {
    isLoaded: false,
    isLogined: false,
    userName: null,
    userEmail: null
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          isLoaded: true,
          isLogined: true,
          userEmail: user.email,
          userName: user.displayName
        });
      } else {
        this.setState({
          isLoaded: true,
          isLogined: false,
          userEmail: null,
          userName: null
        });
      }
      // console.log("<Sidebar> user", user.email, user.displayName);
    });
  }

  render() {
    const { classes, className } = this.props;
    const { isLoaded, isLogined, userEmail, userName } = this.state;

    const rootClassName = classNames(classes.root, className);

    if (isLoaded) {
      if (!isLogined) {
        return <Redirect to="/sign-in" />;
      }
    }

    return (
      <nav className={rootClassName}>
        <div className={classes.logoWrapper}>
          <Link className={classes.logoLink} to="/">
            <img
              alt="WIZCloud logo"
              className={classes.logoImage}
              src="/images/logos/WIZcloud-logo_02.png"
              width="220"
              height="67"
            />
          </Link>
        </div>
        <Divider className={classes.logoDivider} />
        {isLoaded && isLogined ? (
          <div className={classes.profile}>
            <Link to="/account">
              <Avatar alt={userName} className={classes.avatar}>
                {userName.slice(0, 1)}
              </Avatar>
            </Link>
            <Typography className={classes.nameText} variant="h6">
              {userName}
            </Typography>
            <Typography className={classes.bioText} variant="caption">
              {userEmail}
            </Typography>
          </div>
        ) : (
          <CircularProgress className={classes.progressWrapper} />
        )}

        <Divider className={classes.profileDivider} />
        <List component="div" disablePadding>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/dashboard-multi"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Multi Dashboard"
            />
          </ListItem>
          {/* <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/dashboard-single"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Single Dashboard"
            />
          </ListItem> */}
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/device"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <DeviceIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Devices"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/rules"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <RulesIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Rules"
            />
          </ListItem>
        </List>
        <Divider className={classes.listDivider} />
        <List
          component="div"
          disablePadding
          subheader={
            <ListSubheader className={classes.listSubheader}>
              Support
            </ListSubheader>
          }
        >
          <ListItem
            className={classes.listItem}
            component="a"
            href="https://forum.wiznet.io"
            target="_blank"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Customer support"
            />
          </ListItem>
        </List>
      </nav>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Sidebar);
