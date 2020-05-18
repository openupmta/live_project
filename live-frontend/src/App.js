import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import RedirectPage from "./pages/RedirectPage";
import AuthenticatedLayout from "./pages/AuthenticatedLayout";
import LoginPage from "./pages/LoginPage";

class App extends Component {
  render() {
    return (
      <div id="App" className="App">
        <Switch>
          <Route exact path="/" component={RedirectPage} />
          <Route path="/a" component={AuthenticatedLayout} />
          <Route path="/login" component={LoginPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default App;
