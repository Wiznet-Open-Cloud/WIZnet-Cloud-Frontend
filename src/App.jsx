import React, { Component } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

// Material helpers
import { ThemeProvider } from "@material-ui/styles";

// Theme
import theme from "./theme";

// Styles
import "react-perfect-scrollbar/dist/css/styles.css";
import "./assets/scss/index.scss";
// Grid layout Styles
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";

// Routes
import Routes from "./Routes";

// Apollo/Graphql
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

// Browser history
const browserHistory = createBrowserHistory();

// Apollo client configuration
const access_token = localStorage.getItem("access_token");
// console.log("access_token >>", access_token);
const headers = {
  authorization: access_token ? `Bearer ${access_token}` : null
};
const httpLink = new createHttpLink({
  uri: "https://us-central1-wiznetiotservice.cloudfunctions.net/api/wiznet",
  headers: headers
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Router history={browserHistory}>
            <Routes />
          </Router>
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}
