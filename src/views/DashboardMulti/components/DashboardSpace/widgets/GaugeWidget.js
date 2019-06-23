import React, { useState, useEffect } from "react";

import BillboardChart from "react-billboardjs";
import "react-billboardjs/lib/billboard.css";

import isJson from "helpers/isJson";

const size = {
  height: 120
  // width: 150
};

const GaugeWidget = props => {
  const { data, settings } = props;
  const [chartInstance, setChartInstance] = useState(null);
  const [thresholds, setThresholds] = useState([0, 20, 40, 60, 100]);

  useEffect(() => {
    if (data !== undefined) {
      loadData();
    }
  });

  useEffect(() => {
    const getThreshold = () => {
      let val = parseInt(settings.max / 5);
      let newThresholds = [];
      thresholds.map((value, i) => newThresholds.push(val * i));
      // console.log("getThreshold", newThresholds);
      setThresholds(newThresholds);
    };

    getThreshold();
  }, [settings.max]);

  const loadData = () => {
    let label = settings.channel;
    console.log("<GaugeWidget> data >>", data);
    console.log("<GaugeWidget> label >>", label);

    if (label !== undefined) {
      if (label.length > 0) {
        if (isJson(data.data)) {
          //! check json data depth
          let jsonData = JSON.parse(data.data);

          let value = jsonData[label];
          // console.log("<GaugeWidget> loadData()22", label, value);
          if (chartInstance !== null) {
            chartInstance.config("gauge.max", Number(settings.max));
            chartInstance.config("gauge.min", Number(settings.min));
            chartInstance.config("gauge.units", settings.units);
            chartInstance.loadData({
              columns: [[label, value]]
            });
          }
        }
      }
    }
  };

  const colors = ["#FF0000", "#e27600", "#F1C600", "#6aB044", "#e12345"];

  return (
    <BillboardChart
      // isPure
      // unloadBeforeLoad
      data={{
        columns: [],
        type: "gauge"
      }}
      gauge={{
        label: {
          format: function(value, ratio) {
            return value;
          }
        },
        min: Number(settings.min),
        max: Number(settings.max),
        units: settings.units
      }}
      size={size}
      color={{ pattern: colors, threshold: { values: thresholds } }}
      ref={chartInstance => setChartInstance(chartInstance)}
    />
  );
};

export default GaugeWidget;
