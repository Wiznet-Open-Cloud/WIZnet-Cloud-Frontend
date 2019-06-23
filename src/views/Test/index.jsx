import React from "react";
import { Dashboard as DashboardLayout } from "layouts";

import UpdateAuth from "./UpdateToken";

import QueryTest from "./QueryTest";
import MutationTest from "./MutationTest";

const TestPage = () => {
  return (
    <DashboardLayout title="TEST">
      <div styles={{ padding: "20px" }}>
        <UpdateAuth />
        <h4>This is Test Page</h4>
        <hr />
        <QueryTest />
        <hr />
        <MutationTest />
      </div>
    </DashboardLayout>
  );
};

export default TestPage;
