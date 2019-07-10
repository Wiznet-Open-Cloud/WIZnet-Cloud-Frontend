import React from "react";
// import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import { compose } from "recompose";
import { useTab } from "contexts/dashboardContext";

import WidgetMenu from "./WidgetMenu";

import ComboChart from "./widgets/ComboChart";
// Widgets
import ChartVis from "./widgets/ChartVis";
import TextWidget from "./widgets/TextWidget";
import TextInputWidget from "./widgets/TextInputWidget";
import SwitchWidget from "./widgets/SwitchWidget";
import GaugeWidget from "./widgets/GaugeWidget";

const WidgetCard = props => {
  const { eventsDataList, gridIndex, grids, classes } = props;

  const getWidgetData = grid => {
    const type = grid.widget.type;
    const dataSource = grid.widget.settings.dataSource;

    if (eventsDataList.hasOwnProperty(dataSource)) {
      const dataList = eventsDataList[dataSource];

      if (type.includes("chart") || type.includes("combo")) {
        // multi data
        return dataList;
      } else if (type.includes("gauge") || type.includes("text")) {
        // single data
        return dataList[dataList.length - 1];
      }
    } else {
      return null;
    }
  };

  const getCurrentGrid = () => {
    let currentGrid = {};

    grids.map((grid, index) =>
      grid.layout.i === gridIndex ? (currentGrid = grid) : null
    );
    return currentGrid;
  };

  if (getCurrentGrid() !== {}) {
    let grid = getCurrentGrid();
    const settings = grid.widget.settings;
    const widgetType = grid.widget.type;
    // console.log("<WidgetCard> render()22", gridIndex, widgetType);

    return (
      <Card className={classes.card} raised={true}>
        <CardHeader
          className={classes.cardHeader}
          action={<WidgetMenu index={gridIndex} />}
          subheader={<div className="grid-dragHandle">{grid.name}</div>}
        />
        <CardContent className={classes.cardContents}>
          {widgetType.includes("combo") ? (
            <ComboChart
              gItem={grid.layout}
              settings={settings}
              index={gridIndex}
              data={getWidgetData(grid)}
            />
          ) : null}
          {widgetType.includes("chart") ? (
            <ChartVis
              gItem={grid.layout}
              settings={settings}
              index={gridIndex}
              data={getWidgetData(grid)}
            />
          ) : null}
          {widgetType.includes("gauge") ? (
            <GaugeWidget
              gItem={grid.layout}
              settings={settings}
              data={getWidgetData(grid)}
            />
          ) : null}
          {widgetType.includes("text") ? (
            <TextWidget settings={settings} data={getWidgetData(grid)} />
          ) : null}
          {widgetType.includes("input") ? (
            <TextInputWidget settings={settings} />
          ) : null}
          {widgetType.includes("switch") ? (
            <SwitchWidget settings={settings} />
          ) : null}
        </CardContent>
      </Card>
    );
  } else {
    return null;
  }
};

const styles = theme => ({
  card: {
    display: "block",
    width: "100%",
    height: "100%"
  },
  cardHeader: {
    // padding: theme.spacing(1),
    height: "35px",
    paddingBottom: "10px",
    paddingTop: "10px",
    paddingLeft: "15px",
    backgroundColor: "#f3f3f3",
    fontSize: "11px"
  },
  cardContents: {
    padding: "15px 15px"
  }
});

export default compose(
  withStyles(styles),
  useTab(({ state }) => ({
    eventsDataList: state.eventsDataList
  }))
)(WidgetCard);
