import * as React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import YNABConverter from "./components/YNABConverter";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/ynab">
          <YNABConverter />
        </Route>
      </Switch>
    </Router>
  );
}
