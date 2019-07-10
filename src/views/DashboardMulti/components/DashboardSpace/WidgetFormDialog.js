import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  ListItemText,
  FormControl,
  Select,
  InputLabel,
  Input,
  Checkbox,
  Tooltip
} from "@material-ui/core";

import { compose } from "recompose";
import { useTab } from "contexts/dashboardContext";

import FirestoreSnapshot from "platform/Firebase/FirestoreSnapshot";
import withDatasource from "platform/Firebase/withDatasource";

const chartTypes = ["Line", "Bar", "Area", "Scatter", "Column"];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300
    }
  }
};

const useStyles = makeStyles(theme => ({
  textfield: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  container: {
    width: 350,
    padding: 15
  }
}));

const WidgetFormDialog = props => {
  const classes = useStyles();
  const {
    grids,
    selectedGridIndex,
    onGridMenuClose,
    formDialogOpen,
    isSourceChanged,
    dataSourceList,
    channelList,
    handleChange,
    handleChangeSource
  } = props;

  const [values, setValues] = useState({
    isSaved: false,
    dataSourceFieldError: false,
    channelFieldError: false,
    chartTypeFieldError: false
  });
  const [channelFormDisable, setChannelFormDisable] = useState(true);

  useEffect(() => {
    if (isSourceChanged) {
      setChannelFormDisable(false);
      // Initial channel value
      //! 저장된 dashboard load 시에는 초기화하지 않음.
      // handleChange("channel", null);
    }
  }, [isSourceChanged]);

  const handleSave = () => {
    let selectedIdx = selectedGridIndex.toString();

    let gridIdx = 0;
    grids.map((grid, index) =>
      grid.layout.i === selectedIdx ? (gridIdx = index) : null
    );

    let settings = grids[gridIdx].widget.settings;
    if (settings.dataSource) {
      setValues({ ...values, isSaved: true });

      // ? 위젯이 추가될때마다 dashboard save 검토
      onGridMenuClose();
    }
  };

  const onChange = name => event => {
    // console.log("<WidgetFormDialog> onChange", name, event.target.value);

    if (name === "dataSource") {
      handleChangeSource(name, event);
    } else {
      handleChange(name, event);
    }

    setValues({ ...values, isSaved: false });
    // TODO: Form validation
  };

  let gridIdx = 0;
  let selectedIdx = selectedGridIndex.toString();

  if (!grids.hasOwnProperty(gridIdx)) {
    return null;
  }
  grids.map((grid, index) =>
    // find selected grid
    grid.layout.i === selectedIdx ? (gridIdx = index) : null
  );

  // selected grid
  let grid = grids[gridIdx];
  let settings = grid.widget.settings;

  let sourceList = dataSourceList.map(source => {
    return source.displayName;
  });

  // console.log("<WidgetFormDialog> render()");
  return (
    <div>
      {values.isSaved ? <FirestoreSnapshot /> : null}

      <Dialog
        open={formDialogOpen}
        onClose={onGridMenuClose}
        aria-labelledby="widget-form-dialog"
      >
        <DialogTitle id="widget-form-dialog">Widget settings</DialogTitle>
        <DialogContent className={classes.container}>
          <DialogContentText>
            Fill the Form for Widget config :)
          </DialogContentText>
          <TextField
            margin="dense"
            autoFocus
            id="name"
            label="Name"
            fullWidth
            onChange={onChange("name")}
            value={grid.name}
            className={classes.textfield}
          />

          <TextField
            margin="dense"
            id="datasource"
            label="Data source"
            fullWidth
            onChange={onChange("dataSource")}
            select
            value={settings.dataSource}
            required
            error={values.dataSourceFieldError}
            className={classes.textfield}
          >
            {sourceList.map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          {/* single channel */}
          {grid.widget.type.includes("gauge") ||
          grid.widget.type.includes("text") ? (
            <Tooltip
              title="Select device first!"
              placement="right"
              open={!isSourceChanged}
            >
              <TextField
                margin="dense"
                id="channel"
                label="Channel"
                fullWidth
                onChange={onChange("channel")}
                select
                value={settings.channel}
                error={values.channelFieldError}
                className={classes.textfield}
                disabled={channelFormDisable}
              >
                {channelList.map(channel => (
                  <MenuItem key={channel} value={channel}>
                    {channel}
                  </MenuItem>
                ))}
              </TextField>
            </Tooltip>
          ) : null}

          {/* multi channel */}
          {grid.widget.type.includes("combo") ||
          grid.widget.type.includes("chart") ? (
            <FormControl className={classes.textfield}>
              <Tooltip
                title="Select device first!"
                placement="right"
                open={!isSourceChanged}
              >
                <InputLabel htmlFor="select-multiple-checkbox">
                  Channels
                </InputLabel>
              </Tooltip>
              <Select
                multiple
                value={settings.channel}
                onChange={onChange("channel")}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => selected.join(", ")}
                MenuProps={MenuProps}
                disabled={channelFormDisable}
              >
                {channelList.map(value => (
                  <MenuItem key={value} value={value}>
                    <Checkbox checked={settings.channel.indexOf(value) > -1} />
                    <ListItemText primary={value} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}

          {/* 위젯 별 추가 설정 옵션 */}
          {/* Chart */}
          {grid.widget.type.includes("chart") ||
          grid.widget.type.includes("combo") ? (
            <TextField
              margin="dense"
              id="type"
              label="Chart Type"
              fullWidth
              onChange={onChange("chartType")}
              select
              value={settings.chartType}
              error={values.chartTypeFieldError}
              className={classes.textfield}
            >
              {chartTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          ) : null}

          {/* Gauge min/max*/}
          {grid.widget.type.includes("gauge") ? (
            <div>
              <TextField
                margin="dense"
                id="min"
                label="Min"
                onChange={onChange("min")}
                value={settings.min}
                fullWidth
                className={classes.textfield}
              />
              <TextField
                margin="dense"
                id="max"
                label="max"
                onChange={onChange("max")}
                value={settings.max}
                fullWidth
                className={classes.textfield}
              />
            </div>
          ) : null}

          {/* Gauge & text Units */}
          {grid.widget.type.includes("gauge") ||
          grid.widget.type.includes("text") ? (
            <TextField
              margin="dense"
              id="units"
              label="units"
              onChange={onChange("units")}
              value={settings.units}
              fullWidth
              className={classes.textfield}
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={onGridMenuClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

WidgetFormDialog.propTypes = {
  formDialogOpen: PropTypes.bool,
  onGridMenuClose: PropTypes.func,
  onChange: PropTypes.func
};

export default compose(
  useTab(({ state, actions }) => ({
    grids: state.grids,
    // Chart form dialog
    formDialogOpen: state.formDialogOpen,
    isSourceChanged: state.isSourceChanged,
    channelList: state.channelList,
    onGridMenuClose: actions.onGridMenuClose,
    handleChange: actions.handleChange,
    handleChangeSource: actions.handleChangeSource,
    selectedGridIndex: state.selectedGridIndex
  })),
  withDatasource
)(WidgetFormDialog);
