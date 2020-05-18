import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import AuthenticationContainer from '../components/AuthenticationContainer';
import VesselPage from './VesselPage';

class AuthenticatedLayout extends Component {
  render() {
    return (
      <AuthenticationContainer>
        {({ isAuthenticated }) => {
          if (!isAuthenticated) return <Redirect to="/login" />;

          return (
            <div className="AuthenticatedLayout">
              <Switch>
                <Route path="/a/vessel" component={VesselPage} />

                <Redirect to="/a/vessel" />
              </Switch>
            </div>
          );
        }}
      </AuthenticationContainer>
    );
  }
}

export default AuthenticatedLayout;
