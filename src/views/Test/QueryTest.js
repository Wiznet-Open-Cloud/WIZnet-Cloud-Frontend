import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const getDataSourceList = ({ email }) => gql`
  {
    getDataSource(email: ${email}) {
      createdAt
      dataSourceId
      dataSourceType
      displayName
      mqttProxy {
        host
        username
        password
      }
      options
      owner
      state
    }
  }
`;

console.log("query:", getDataSourceList);

const QueryTest = () => {
  const userEmail = "rena@wiznet.io";

  return (
    <Query query={getDataSourceList({ userEmail })}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) {
          console.log("<QueryTest> error ==> ", error);
          return <div>error!</div>;
        }

        console.log("getDataSource data >>", data);

        return data.getDataSource.map((obj, i) => (
          <div key={i}>
            <p>
              {`${obj.dataSourceId}`}, {`${obj.owner}`}
            </p>
          </div>
        ));
      }}
    </Query>
  );
};

export default QueryTest;
