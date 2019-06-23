import React from "react";

import { auth, firestore } from "./Firebase";

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

const withDatasource = WrappedComponent => {
  return class extends React.Component {
    static displayName = `withDatasource(${getDisplayName(WrappedComponent)})`;

    state = {
      sourceList: []
    };

    componentDidMount() {
      let sourceList = [];

      auth.onAuthStateChanged(user => {
        if (user) {
          // console.log("<withDatasource> auth: ", user.displayName);
          firestore
            .collection("dataSource")
            .where("owner", "==", user.email)
            .get()
            .then(query => {
              query.forEach(doc => {
                // sourceList.push(doc.id);
                sourceList.push(doc.data());
              });
              // console.log("<withDatasource> sourceList: ", sourceList);
              this.setState({ sourceList: sourceList });
            });
        }
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          dataSourceList={this.state.sourceList}
        />
      );
    }
  };
};

export default withDatasource;
