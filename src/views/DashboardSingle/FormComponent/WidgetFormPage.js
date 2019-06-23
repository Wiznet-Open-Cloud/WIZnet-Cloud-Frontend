import React, { useState } from "react";
import Button from "@material-ui/core/Button";

import WidgetForm from "./WidgetForm";
import withDatasource from "platform/Firebase/withDatasource";

const WidgetFormPage = props => {
  const [formOpen, setFormOpen] = useState(false);

  const { dataSourceList } = props;

  var sourceList = dataSourceList.map(source => {
    return source.displayName;
  });

  return (
    <div>
      <Button onClick={() => setFormOpen(true)}>Open form</Button>
      <WidgetForm
        formOpen={formOpen}
        sourceList={sourceList}
        handleClose={() => setFormOpen(false)}
      />
    </div>
  );
};

export default withDatasource(WidgetFormPage);
