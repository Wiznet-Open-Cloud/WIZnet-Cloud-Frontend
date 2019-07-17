import React from "react";
import _ from "lodash";

import { firestore } from "./Firebase";
import { useTab } from "contexts/dashboardContext";

const maxDataNumber = 20;

class FirestoreSnapshot extends React.Component {
  componentDidMount() {
    this.collectionSnapshot();
  }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  collectionSnapshot = () => {
    const {
      grids,
      selectedGridIndex,
      updateEventsData,
      eventsDataList
    } = this.props;

    if (grids.length > 0) {
      const selectedIdx = selectedGridIndex.toString();
      let gridIdx;
      grids.map((grid, index) =>
        grid.layout.i === selectedIdx ? (gridIdx = index) : null
      );

      let grid = grids[gridIdx];
      const dataSource = grid.widget.settings.dataSource;

      if (dataSource.length > 0) {
        let newEventDataList = _.cloneDeep(eventsDataList);

        let eventData = []; // events collection

        this.unsubscribe = firestore
          .collection("dataSource")
          .doc(dataSource)
          .collection("events")
          .orderBy("createdAt", "desc")
          .limit(maxDataNumber)
          .onSnapshot(
            querySnapshot => {
              querySnapshot
                .docChanges()
                .reverse()
                .forEach(change => {
                  if (change.type === "added") {
                    let createdAt = change.doc.data().createdAt;
                    let rawData = change.doc.data().data;

                    eventData.push({
                      time: createdAt,
                      data: rawData
                    });

                    // 일정 데이터 수 유지
                    if (eventData.length > maxDataNumber) {
                      eventData.shift();
                    }
                  }
                });
              console.log("<FirestoreSnapshot> >>", dataSource);

              newEventDataList[dataSource] = eventData; // events collection data
              updateEventsData(newEventDataList);
            },
            error => {
              console.log("<FirestoreSnapshot> error", error);
            }
          );
      }
    }
  };

  render() {
    return null;
  }
}

export default useTab(({ state, actions }) => ({
  grids: state.grids,
  selectedGridIndex: state.selectedGridIndex,
  updateEventsData: actions.updateEventsData,
  eventsDataList: state.eventsDataList
}))(FirestoreSnapshot);
