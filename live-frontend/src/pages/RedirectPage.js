import React, { Component } from "react";
import AuthenticationContainer from "../components/AuthenticationContainer";
import { Redirect } from "react-router-dom";

class RedirectPage extends Component {
  render() {
    return (
      <AuthenticationContainer>
        {({ isAuthenticated }) => {
          const redirectTo = isAuthenticated ? "/a" : "/login";
          return <Redirect to={redirectTo} />;
        }}
      </AuthenticationContainer>
    );
  }
}

export default RedirectPage;
