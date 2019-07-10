import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Views
import DeviceList from "./views/DeviceList";
import SignIn from "./views/SignIn";
import UnderDevelopment from "./views/UnderDevelopment";
import NotFound from "./views/NotFound";

import DashboardMulti from "./views/DashboardMulti";
import RulePage from "./views/Rules";

// temp test page
import TestPage from "./views/Test";

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/dashboard" />
        <Route component={DashboardMulti} exact path="/dashboard" />
        <Route component={DeviceList} exact path="/device" />
        <Route component={RulePage} exact path="/rules" />
        <Route component={SignIn} exact path="/sign-in" />
        <Route component={TestPage} exact path="/test" />
        <Route component={UnderDevelopment} exact path="/under-development" />
        <Route component={NotFound} exact path="/not-found" />
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}
