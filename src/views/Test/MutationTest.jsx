import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

// const jsonData =
//   '{"dataSourceTypeId":"wizmkr","context":{"config":{"versionToUpdate":"","binaryData":"{\\"red\\":255,\\"green\\":214,\\"blue\\":33}"}},"eventType":"DEVICE_CONFIG","dataSourceId":"wizmkr-02","createdAt":"2018-12-04T07:46:54.194Z"}';

// mutation
const ADD_ACTION = gql`
  mutation($value: String!) {
    addActionEvents(actionEvents: $value) {
      value
    }
  }
`;

const actionData = {
  context: {
    config: {
      binaryData: "test",
      versionToUpdate: ""
    }
  },
  dataSourceId: "test-01",
  dataSourceTypeId: "testgroup",
  createdAt: "",
  eventType: "DEVICE_CONFIG"
};

const value = JSON.stringify(actionData);

const MutationTest = () => {
  console.log("json string data", value);

  return (
    <div>
      Mutation Test
      <Mutation mutation={ADD_ACTION} variables={{ value: value }}>
        {addAction => (
          <button type="button" onClick={addAction}>
            ACTION
          </button>
        )}
      </Mutation>
    </div>
  );
};

export default MutationTest;
