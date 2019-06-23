import React from "react";
import { Chart } from "react-google-charts";

const ChartTest = props => {
  console.log("<ChartTest> props", props);
  return (
    <div className={"my-pretty-chart-container"}>
      <Chart
        chartType="ScatterChart"
        data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
        width="100%"
        height="400px"
        legendToggle
      />
    </div>
  );
};

export default ChartTest;
