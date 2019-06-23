import React, { Component, createContext } from "react";
import createUseConsumer from "helpers/createUseConsumer";

import { firestore } from "platform/Firebase/Firebase";

import isJson from "helpers/isJson";

const defaultSettings = {
  dataSource: "",
  // channel: ""
  channel: []
};

const defaultGrid = {
  x: 0,
  y: 0,
  w: 2,
  h: 2,
  i: "0",
  isDraggable: true,
  isResizable: true,
  maxW: 12,
  maxH: 12,
  minW: 2,
  minH: 2
};

const Context = createContext();
const { Provider, Consumer: DashboardConsumer } = Context;

class DashboardProvider extends Component {
  state = {
    // =========================================================
    tabs: [
      {
        label: "Dashboard #0",
        index: 0 // tab index
      }
    ],
    grids: [
      // {
      //   tabIndex: 0,
      //   name: "test1",
      //   layout: {
      //     ...defaultGrid
      //   },
      //   widget: {
      //     type: "gauge",
      //     settings: {
      //       dataSource: "",
      //       channel: ""
      //     }
      //   }
      // },
    ],

    cols: 12,
    currentTab: 0, // 현재 선택된 Tab index
    selectedGridIndex: 0, // 마지막으로 선택된 grid index

    // =========================================================
    eventsDataList: {}, // dataSource events 데이터 모음 (개수 지정)

    /* Chart state */
    formDialogOpen: false, // form dialog state
    // firestore datasource
    isSourceLoading: false, // dataSource가 로딩되었나?
    isSourceChanged: false, // dataSource가 선택되었나?
    dataSourceList: [], // owner가 현재 유저인 datasource list
    channelList: [], // 선택된 datasource의 channel list

    userDataisLoading: false // user dashboard가 로딩되었나?
  };

  // ? dashboard actions 세분화?

  actions = {
    /**
     * @ Tab actions
     */
    handleTabChange: (event, value) => {
      console.log("<tab> handleTabChange()", value, this.state.tabs[value]);

      this.setState({ currentTab: value });
    },

    addTab: () => {
      const { tabs } = this.state;
      let numOfTabs = tabs.length;

      // last tab index + 1
      const index = tabs[numOfTabs - 1].index + 1;

      if (numOfTabs === 5) {
        alert("Sorry. No more Dashboard.");
      } else {
        this.setState({
          tabs: tabs.concat({
            label: "Dashboard #" + index.toString(),
            index: index
          })
        });
      }
    },

    removeTab: () => {
      const { tabs, currentTab, grids } = this.state;

      if (tabs.length === 1) {
        alert("Sorry. This is last tab.");
      } else {
        let newTabs = tabs.slice();
        newTabs.splice(currentTab, 1);

        let newGrids = grids.filter(grid => grid.tabIndex !== currentTab);
        console.log("<tab> removeTab()", newGrids);

        this.setState({ tabs: newTabs, currentTab: 0, grids: newGrids });
      }
    },

    /**
     * @ Grid actions
     */
    addGrid: (type, index) => {
      const { grids, currentTab } = this.state;

      let settings = {};
      if (type.includes("chart") || type.includes("combo")) {
        settings = {
          ...defaultSettings,
          chartType: ""
        };
      } else if (type.includes("gauge")) {
        settings = {
          ...defaultSettings,
          min: 0,
          max: 100,
          units: ""
        };
      } else if (type.includes("text")) {
        settings = { ...defaultSettings, units: "" };
      } else if (type.includes("input") || type.includes("switch")) {
        settings = { ...defaultSettings };
        delete settings["sourceChannel"];
      }

      // index check
      let newIndex = 0;
      if (grids.length > 0) {
        newIndex = Number(grids[grids.length - 1].layout.i) + 1;
      }

      let newGrid = {
        tabIndex: currentTab,
        name: "",
        layout: {
          ...defaultGrid,
          i: newIndex.toString(),
          x: (grids.length * 2) % (this.state.cols || 12),
          y: 0
        },
        widget: {
          type: type,
          settings: settings
        }
      };

      console.log("addGrid()", newGrid);

      this.setState({ grids: grids.concat(newGrid) });
    },

    removeGrid: index => {
      const { grids } = this.state;
      let newGrids = grids.slice();

      let idx = index.toString();

      grids.map((grid, index) =>
        grid.layout.i === idx ? newGrids.splice(index, 1) : null
      );

      console.log("removeGrid()", index, newGrids);

      this.setState({ grids: newGrids });
    },

    onLayoutChange: layouts => {
      const { grids } = this.state;

      let newGrids = grids.slice();

      newGrids.map(newGrid =>
        layouts.map(layout =>
          newGrid.layout.i === layout.i ? (newGrid.layout = layout) : null
        )
      );

      // console.log("<tab> onLayoutChange()", newGrids);
      this.setState({ grids: newGrids });
    },

    getBreakPoint: cols => {
      // console.log("<tab> getBreakPoint()", cols);
      this.setState({ cols: cols });
    },

    /**
     * @ Chart actions
     */
    onGridMenuClick: index => {
      console.log("<tab> onGridMenuClick()", index);
      this.setState({ formDialogOpen: true, selectedGridIndex: index });
    },
    onGridMenuClose: () => {
      this.setState({ formDialogOpen: false });
    },

    handleChange: (name, event) => {
      const { grids, selectedGridIndex } = this.state;
      let selectedIdx = selectedGridIndex.toString();

      // console.log("handleChange:", name, event.target.value);

      if (name === "name") {
        this.setState({
          grids: grids.map(grid =>
            grid.layout.i === selectedIdx
              ? {
                  ...grid,
                  [name]: event.target.value
                }
              : grid
          )
        });
      } else {
        this.setState({
          grids: grids.map(grid =>
            grid.layout.i === selectedIdx
              ? {
                  ...grid,
                  widget: {
                    ...grid.widget,
                    settings: {
                      ...grid.widget.settings,
                      [name]: event.target.value
                    }
                  }
                }
              : grid
          )
        });
      }
    },

    handleChangeSource: (name, event) => {
      const { grids, selectedGridIndex } = this.state;
      let selectedIdx = selectedGridIndex.toString();

      this.setState({
        grids: grids.map(grid =>
          grid.layout.i === selectedIdx
            ? {
                ...grid,
                widget: {
                  ...grid.widget,
                  settings: {
                    ...grid.widget.settings,
                    [name]: event.target.value
                  }
                }
              }
            : grid
        ),
        isSourceChanged: true
      });

      // Get selected source's channel
      let channels = [];
      /* 마지막 events 데이터로부터 가져옴 */
      firestore
        .collection("dataSource")
        .doc(event.target.value)
        .collection("events")
        .orderBy("createdAt", "desc")
        .limit(1)
        .get()
        .then(query => {
          // events로 받은 데이터의 key 추출
          query.forEach(doc => {
            // console.log("get sourceName from EVENTS", doc.data().data);
            let rawData = doc.data().data;
            if (isJson(rawData)) {
              let jsonData = JSON.parse(rawData);
              channels = Object.keys(jsonData);
              this.setState({ channelList: channels });
            } else {
              alert("There is no data from Device.");
            }
          });
        });
    },

    onUpdate: sourceList => {
      this.setState({ dataSourceList: sourceList, isSourceLoading: true });
    },

    /**
     * update, save, load Tab(& grid & chart)
     */
    loadTab: dashboard => {
      this.setState({ tabs: dashboard.tabs, grids: dashboard.grids });
    },

    updateEventsData: newData => {
      console.log("<tab> updateEventsData()", Object.keys(newData), newData);

      this.setState({ eventsDataList: newData, formDialogOpen: false });
    }
  };

  // componentDidUpdate(prevProps, prevState) {
  //   Object.entries(this.props).forEach(
  //     ([key, val]) =>
  //       prevProps[key] !== val &&
  //       console.log(`<Tab Context> Prop '${key}' changed`)
  //   );
  //   Object.entries(this.state).forEach(
  //     ([key, val]) =>
  //       prevState[key] !== val &&
  //       console.log(`<Tab Context> State '${key}' changed`)
  //   );
  // }

  render() {
    const { state, actions } = this;
    const value = { state, actions };
    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

const useTab = createUseConsumer(DashboardConsumer);

export { DashboardProvider, DashboardConsumer, useTab };
