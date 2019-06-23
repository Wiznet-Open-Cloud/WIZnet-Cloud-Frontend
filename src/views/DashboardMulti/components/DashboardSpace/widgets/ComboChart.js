import React from "react";
import { Chart } from "react-google-charts";

import isJson from "helpers/isJson";
import { makeStyles } from "@material-ui/styles";

const ComboChart = props => {
  const classes = useStyles();
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

  if (settings.channel === "") {
    return null;
  }

  // console.log("<ComboChart> props", props);
  return (
    <div className={classes.container}>
      <div className={"my-pretty-chart-container"}>
        <Chart
          key={type}
          chartType={type}
          loader={<div>Loading Chart</div>}
          data={convertData()}
          width="100%"
          height="100%"
          legendToggle
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  container: {
    // display: "flex",
    width: "100%"
  },
  chart: {
    display: "flex",
    width: "100%",
    height: "100%"
  }
});

export default ComboChart;
