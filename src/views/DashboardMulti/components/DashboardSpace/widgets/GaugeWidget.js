import React, { useState, useEffect } from "react";

import BillboardChart from "react-billboardjs";
import "react-billboardjs/lib/billboard.css";

import isJson from "helpers/isJson";

const size = {
  height: 120
  // width: 150
};

const colorPattern = ["#FF0000", "#e27600", "#F1C600", "#e12345", "#6aB044"];

const GaugeWidget = props => {
  const { data, settings } = props;
  const [chartInstance, setChartInstance] = useState(null);
  const [thresholds, setThresholds] = useState([1, 20, 40, 60, 100]);

  useEffect(() => {
    if (data !== null) {
      loadData();
    }
  });

  useEffect(() => {
    const getThreshold = () => {
      let val = parseInt(settings.max / 5);
      let newThresholds = [];
      thresholds.map((value, i) => newThresholds.push(val * i + 1));
      // console.log("getThreshold", newThresholds);
      setThresholds(newThresholds);
    };

    getThreshold();
  }, [settings.max]);

  const calHeight = () => {
    let height = 200;

    // grid height 값에 따른 chart height 계산
    try {
      let gridH = props.gItem.h;
      height = gridH * 100 - 80;
    } catch (err) {
      console.log("<ChartVis> ERROR:", err);
    }
    return height;
  };

  const loadData = () => {
    let label = settings.channel;
    // console.log("<GaugeWidget> label >>", label, settings.channel);

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
            chartInstance.config("color.threshold", { values: thresholds });
            chartInstance.config("size.height", calHeight());

            chartInstance.loadData({
              columns: [[label, value]]
              // unload: [old_label]
            });

            // old/new label comparison
            // console.log("chart.data", chartInstance.chart.data.shown());
            if (chartInstance.chart.data.shown().length > 1) {
              let oldLabel = chartInstance.chart.data.shown()[0].id;
              chartInstance.chart.unload(oldLabel);
            }
          }
        }
      }
    }
  };

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
      color={{ pattern: colorPattern, threshold: { values: thresholds } }}
      ref={chartInstance => setChartInstance(chartInstance)}
    />
  );
};

export default GaugeWidget;
