import React from "react";
import { Chart } from "react-google-charts";

import isJson from "helpers/isJson";

const ComboChart = props => {
  const { settings, data } = props;

  const [type, setType] = React.useState("AreaChart");

  React.useEffect(() => {
    if (settings.chartType !== "") {
      console.log("<ComboChart> Type >>", settings.chartType);
      setType(settings.chartType + "Chart");
    }
  }, [settings.chartType]);

  const convertData = () => {
    let chartData = [];

    if (data) {
      let labels = ["time"].concat(settings.channel);
      chartData = [labels];

      data.forEach(events => {
        // make time string
        let time = new Date(events.time.seconds * 1000).toLocaleString();
        let ms = (events.time.nanoseconds / 1000000).toString();

        // settings.channel: ["AI1", "AI2", "AI3"]
        if (isJson(events.data)) {
          let jsonData = JSON.parse(events.data);

          let data = [`${time}.${ms}`];
          settings.channel.forEach(channel => data.push(jsonData[channel]));
          chartData.push(data);
        }
      });
    }
    // console.log("<ComboChart> chartData", chartData);
    return chartData;
  };

  const calHeight = () => {
    let height = 200;

    // grid height 값에 따른 chart height 계산
    try {
      let gridH = props.gItem.h;
      height = gridH * 100 - 20;
    } catch (err) {
      console.log("<ChartVis> ERROR:", err);
    }
    return height;
  };

  const chartWrapper = ChartWrapper => {
    if (ChartWrapper !== null) {
      console.log("chartWrapper >>", ChartWrapper);
      console.log("chartWrapper >>", ChartWrapper.props.height);
    }
  };

  // console.log("<ComboChart> props", props);
  return (
    <div className={"chart-container"}>
      <Chart
        key={type}
        chartType={type}
        loader={<div>Loading Chart...</div>}
        data={convertData()}
        width="100%"
        // height="100%"
        height={calHeight()}
        legendToggle
        ref={chartWrapper}
      />
    </div>
  );
};

export default ComboChart;
