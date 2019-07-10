import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core";
import { CircularProgress, Typography } from "@material-ui/core";

import { Dashboard as DashboardLayout } from "layouts";

import { DevicesToolbar, DevicesTable } from "./components";

// Component styles
import styles from "./style";

// Firebase
import { auth, firestore, storage } from "platform/Firebase/Firebase";

const defaultImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/wiznetiotservice.appspot.com/o/deviceImage%2Fdefault%2Fdefault_logo.png?alt=media&token=f82d9094-7d56-46ac-8432-72db5cfdae2b";

class DeviceList extends React.Component {
  signal = true;

  state = {
    isLoading: true,
    limit: 10,
    devices: [],
    selectedDevices: [],
    error: null,
    images: { default: defaultImageUrl },
    currentUser: null
  };

  getDeviceImage = async devices => {
    devices.forEach(async device => {
      const type = device.dataSourceType;
      const filename = "thumb@64_" + device.dataSourceType;
      try {
        const storageUrl = await storage
          .child(`deviceImage/${type}/${filename}.png`)
          .getDownloadURL();

        // console.log(`getDeviceImage: ${type}: ${storageUrl}`);
        this.setState({
          images: {
            ...this.state.images,
            [type]: storageUrl
          }
        });
      } catch (err) {
        console.log(`No device image for ${type}`);
      }
    });
  };

  async getDevices() {
    let deviceList = [];

    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("<DevicesTable> auth: ", user.displayName);
        firestore
          .collection("dataSource")
          .where("owner", "==", user.email)
          .get()
          .then(query => {
            query.forEach(doc => {
              deviceList.push(doc.data());
            });
            console.log("<DevicesTable> deviceList: ", deviceList);
            // get device image url
            this.getDeviceImage(deviceList);
            this.setState({
              devices: deviceList,
              isLoading: false,
              currentUser: user.email
            });
          });
      }
    });
  }

  componentDidMount() {
    this.signal = true;
    this.getDevices();
  }

  componentWillUnmount() {
    this.signal = false;
  }

  handleSelect = selectedDevices => {
    console.log("<DeviceList> selected device >>", selectedDevices);
    this.setState({ selectedDevices });
  };

  // Delete device(s)
  handleDelete = () => {
    console.log("handleDelete()");
    this.state.selectedDevices.map(device =>
      firestore
        .collection("dataSource")
        .doc(device)
        .delete()
        .then(() => {
          console.log("device deleted complete. >>", device);
        })
        .catch(error => {
          console.log("delete device error", error);
        })
    );
  };

  renderDevices() {
    const { classes } = this.props;
    const { isLoading, error, devices, images } = this.state;

    if (isLoading) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return <Typography variant="h6">{error}</Typography>;
    }

    if (devices.length === 0) {
      return <Typography variant="h6">There are no devices</Typography>;
    }

    return (
      <DevicesTable
        //
        onSelect={this.handleSelect}
        devices={devices}
        images={images}
      />
    );
  }

  render() {
    const { classes } = this.props;
    const { selectedDevices, currentUser } = this.state;

    return (
      <DashboardLayout title="Devices">
        <div className={classes.root}>
          <DevicesToolbar
            selectedDevices={selectedDevices}
            handleDelete={this.handleDelete}
            currentUser={currentUser}
          />
          <div className={classes.content}>{this.renderDevices()}</div>
        </div>
      </DashboardLayout>
    );
  }
}

DeviceList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DeviceList);
