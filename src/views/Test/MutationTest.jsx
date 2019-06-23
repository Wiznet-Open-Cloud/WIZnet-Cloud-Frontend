import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const jsonData =
  '{"dataSourceTypeId":"wizmkr","context":{"config":{"versionToUpdate":"","binaryData":"{\\"red\\":255,\\"green\\":214,\\"blue\\":33}"}},"eventType":"DEVICE_CONFIG","dataSourceId":"wizmkr-02","createdAt":"2018-12-04T07:46:54.194Z"}';

// mutation
const ADD_ACTION = gql`
  mutation addActionEvents($value: String!) {
    addActionEvents(value: $value) {
      value
    }
  }
`;

const MutationTest = () => {
  return (
    <div>
      Mutation Test
      <Mutation mutation={ADD_ACTION} variables={{ jsonData }}>
        {(addActionEvents, { data }) => (
          <button type="button" onClick={addActionEvents}>
            ADD ACTION
          </button>
        )}
      </Mutation>
    </div>
  );
};

export default MutationTest;
