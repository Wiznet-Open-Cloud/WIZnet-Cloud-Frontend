import React, { useState } from "react";

import { Button } from "@material-ui/core";
import DeveloperDeviceRegister from "./DeveloperDeviceRegister";

const DeviceDeveloper = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        color="secondary"
        size="small"
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Register Device for Developer
      </Button>
      <DeveloperDeviceRegister open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default DeviceDeveloper;
