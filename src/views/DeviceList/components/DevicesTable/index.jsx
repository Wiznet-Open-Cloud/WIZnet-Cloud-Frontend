import React, { Component } from "react";
import { Link } from "react-router-dom";

// Externals
import classNames from "classnames";
import PropTypes from "prop-types";
// import PerfectScrollbar from "react-perfect-scrollbar";

// Material helpers
import { withStyles, Button } from "@material-ui/core";

// Material components
import {
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from "@material-ui/core";

// Shared components
import { Portlet, PortletContent } from "components";

// Component styles
import styles from "./styles";
import DeviceDetail from "../DeviceDetail";

class DevicesTable extends Component {
  state = {
    selectedDevices: [],
    rowsPerPage: 10,
    page: 0,
    dialogOpen: false,
    clickedDeviceIndex: 0
  };

  handleSelectAll = event => {
    const { devices, onSelect } = this.props;

    let selectedDevices;

    if (event.target.checked) {
      selectedDevices = devices.map(device => device.dataSourceId);
    } else {
      selectedDevices = [];
    }

    this.setState({ selectedDevices });

    onSelect(selectedDevices);
  };

  handleSelectOne = (event, id) => {
    const { onSelect } = this.props;
    const { selectedDevices } = this.state;

    const selectedIndex = selectedDevices.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedDevices, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedDevices.slice(1));
    } else if (selectedIndex === selectedDevices.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedDevices.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedDevices.slice(0, selectedIndex),
        selectedDevices.slice(selectedIndex + 1)
      );
    }

    this.setState({ selectedDevices: newSelectedUsers });

    onSelect(newSelectedUsers);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleClick = index => event => {
    // console.log("device clicked!", index);
    this.setState({ dialogOpen: true, clickedDeviceIndex: index });
  };
  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const { classes, className, devices, images } = this.props;
    const {
      activeTab,
      selectedDevices,
      rowsPerPage,
      page,
      dialogOpen,
      clickedDeviceIndex
    } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <Checkbox
                      checked={selectedDevices.length === devices.length}
                      color="primary"
                      indeterminate={
                        selectedDevices.length > 0 &&
                        selectedDevices.length < devices.length
                      }
                      onChange={this.handleSelectAll}
                    />
                    Name
                  </TableCell>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">State</TableCell>
                  <TableCell align="left">Device Type</TableCell>
                  <TableCell align="left">Creation date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices
                  .filter(device => {
                    if (activeTab === 1) {
                      return !device.returning;
                    }

                    if (activeTab === 2) {
                      return device.returning;
                    }

                    return device;
                  })
                  .slice(0, rowsPerPage)
                  .map((device, index) => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={device.dataSourceId}
                      selected={
                        selectedDevices.indexOf(device.dataSourceId) !== -1
                      }
                    >
                      <TableCell className={classes.tableCell}>
                        <div className={classes.tableCellInner}>
                          <Checkbox
                            checked={
                              selectedDevices.indexOf(device.dataSourceId) !==
                              -1
                            }
                            color="primary"
                            onChange={event =>
                              this.handleSelectOne(event, device.dataSourceId)
                            }
                            value="true"
                          />
                          <Avatar
                            className={classes.avatar}
                            src={
                              images.hasOwnProperty(device.dataSourceType)
                                ? images[device.dataSourceType]
                                : images["default"]
                            }
                          >
                            {/* {getInitials(device.name)} */}
                            {device.dataSourceId.slice(0, 2)}
                          </Avatar>
                          <Link to="#">
                            <Typography
                              className={classes.nameText}
                              variant="body1"
                            >
                              <Button
                                className={classes.button}
                                onClick={this.handleClick(index)}
                              >
                                {device.displayName}
                              </Button>
                            </Typography>
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {device.dataSourceId}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {device.state}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {device.dataSourceType}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {new Date(
                          device.createdAt.seconds * 1000
                        ).toLocaleString("en-GB", {
                          timeZone: "Asia/Seoul",
                          timeZoneName: "short"
                        })}
                        {/* {moment(device.createdAt).format("DD/MM/YYYY")} */}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {/* Device detail dialog */}
            <DeviceDetail
              open={dialogOpen}
              onClose={this.handleClose}
              devices={devices}
              images={images}
              index={clickedDeviceIndex}
            />
          </div>

          <TablePagination
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            component="div"
            count={devices.length}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </PortletContent>
      </Portlet>
    );
  }
}

DevicesTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onShowDetails: PropTypes.func,
  devices: PropTypes.array.isRequired
};

DevicesTable.defaultProps = {
  devices: [],
  onSelect: () => {},
  onShowDetails: () => {}
};

export default withStyles(styles)(DevicesTable);
