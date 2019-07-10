import React from "react";
import { compose } from "recompose";
import { useTab } from "contexts/dashboardContext";

import { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import WidgetCard from "./WidgetCard";
import WidgetFormDialog from "./WidgetFormDialog";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ResponsiveGridLayout = props => {
  const { grids, currentTab } = props;

  const generateDOM = () => {
    let currTabGrids = grids.filter(grid => grid.tabIndex === currentTab);

    return currTabGrids.map(grid => {
      return (
        <div key={grid.layout.i} data-grid={grid.layout}>
          <WidgetCard grids={grids} gridIndex={grid.layout.i} />
        </div>
      );
    });
  };

  const onBreakpointChange = (breakpoint, cols) => {
    console.log("onBreakpointChange()", breakpoint, cols);
    props.getBreakPoint(cols);
  };

  const onLayoutChange = (layout, layouts) => {
    // console.log("onLayoutChange()", layout, layouts);
    props.onLayoutChange(layouts);
  };

  if (grids.length === 0) {
    return null;
  }

  return (
    <div>
      <ResponsiveReactGridLayout
        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
        onBreakpointChange={onBreakpointChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        // Grid drag handler part
        draggableHandle=".grid-dragHandle"
        compactType="horizontal"
        {...props}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>

      <WidgetFormDialog />
    </div>
  );
};

ResponsiveGridLayout.defaultProps = {
  className: "layout",
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  // cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 100
};

export default compose(
  useTab(({ state, actions }) => ({
    grids: state.grids,
    currentTab: state.currentTab,
    getBreakPoint: actions.getBreakPoint,
    onLayoutChange: actions.onLayoutChange
  }))
)(ResponsiveGridLayout);
