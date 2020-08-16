import * as React from "react";
import { Route, Switch } from "react-router-dom";
import YNABConverter from "./components/YNABConverter";

export default function Routes() {
  return (
    <Switch>
      <Route path="/ynab">
        <YNABConverter />
      </Route>
    </Switch>
  );
}
