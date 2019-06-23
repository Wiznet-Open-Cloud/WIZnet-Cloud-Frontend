import React, { useState, useEffect } from "react";

import { TextField, MenuItem, Grid, makeStyles } from "@material-ui/core";

import { Dashboard as DashboardLayout } from "layouts";

import RuleSetting from "./RuleSetting";
import RuleList from "./RuleList";
import isJson from "helpers/isJson";
import { firestore } from "platform/Firebase/Firebase";
import withDatasource from "platform/Firebase/withDatasource";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    padding: 20,
    overflowX: "auto"
  }
}));

const RulePage = props => {
  const classes = useStyles();
  const [dataSource, setDataSource] = useState("");
  const [channelList, setChannelList] = useState([]);

  const { dataSourceList } = props;
  var sourceList = dataSourceList.map(source => {
    return source.displayName;
  });

  useEffect(() => {
    if (dataSource !== "") {
      initChannels(dataSource);
    }
  }, [dataSource]);

  const initChannels = dataSource => {
    var channels = [];
    /* 마지막 events 데이터로부터 가져옴 */
    firestore
      .collection("dataSource")
      .doc(dataSource)
      .collection("events")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then(query => {
        // events로 받은 데이터의 key 추출
        query.forEach(doc => {
          console.log("get sourceName from EVENTS", doc.data().data);
          var rawData = doc.data().data;
          if (isJson(rawData)) {
            var jsonData = JSON.parse(rawData);
            channels = Object.keys(jsonData);
            setChannelList(channels);
          } else {
            alert("There is no data from Device.");
          }
        });
      });
  };

  return (
    <DashboardLayout title="Rules">
      <div className={classes.root}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={4}>
            <TextField
              margin="dense"
              id="dataSource"
              label="Datasource target"
              fullWidth
              onChange={e => setDataSource(e.target.value)}
              select
              value={dataSource}
              required
            >
              {sourceList.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        {dataSource !== "" ? (
          <Grid container>
            <Grid item xs={12}>
              <RuleSetting
                dataSource={dataSource}
                sourceList={sourceList}
                channels={channelList}
              />
            </Grid>
            <Grid item xs={12}>
              <RuleList dataSource={dataSource} />
            </Grid>
          </Grid>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default withDatasource(RulePage);
