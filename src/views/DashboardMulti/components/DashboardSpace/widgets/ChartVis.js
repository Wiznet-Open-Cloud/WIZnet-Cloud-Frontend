import React from "react";
import "react-vis/dist/style.css";
import {
  FlexibleXYPlot,
  LineSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  AreaSeries
  // Crosshair
} from "react-vis";

import isJson from "helpers/isJson";

const ChartVis = props => {
  const { settings, data } = props;

  let type = "Line";
  if (settings.chartType !== "") {
    type = settings.chartType;
  }

  const convertData = () => {
    let chartData = [];

    if (data) {
      data.forEach(events => {
        // make time string
        let time = new Date(events.time.seconds * 1000).toLocaleString();
        let ms = (events.time.nanoseconds / 1000000).toString();

        if (isJson(events.data)) {
          let jsonData = JSON.parse(events.data);
          chartData.push({
            x: `${time}.${ms}`,
            y: jsonData[settings.channel]
          });
        }
      });
    }
    // console.log("<ChartVis> convertData()", chartData);
    return chartData;
  };

  const calHeiget = () => {
    let height = 200;

    // grid height 값에 따른 chart height 계산
    try {
      let gridH = props.gItem.h;
      if (gridH < 6) {
        height = gridH * 100 - 40;
      } else if (gridH > 8) {
        height = gridH * 100 + 10;
      } else {
        height = gridH * 100 - 10;
      }
    } catch (err) {
      console.log("<ChartVis> ERROR:", err);
    }
    return height;
  };

  if (settings.channel === "") {
    return null;
  }
  return (
    <FlexibleXYPlot
      height={calHeiget()}
      xType="ordinal"
      // yDomain={[0, 4096]}
    >
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis
        title="Time"
        tickValues={convertData().map((data, i) =>
          i % 4 === 1 ? data.x : null
        )}
      />
      <YAxis title="Data" />

      {type === "Line" || type === "" ? (
        <LineSeries data={convertData()} />
      ) : null}
      {type === "Bar" ? <VerticalBarSeries data={convertData()} /> : null}
      {type === "Area" ? (
        <AreaSeries data={convertData()} opacity={0.5} />
      ) : null}
    </FlexibleXYPlot>
  );
};

export default ChartVis;
