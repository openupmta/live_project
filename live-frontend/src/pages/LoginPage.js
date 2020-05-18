import React, { Component } from 'react';
import SnackBarComponent from '../components/SnackBarComponent';
import {
  setAccessToken,
  setUserData,
  notifyUpdate
} from '../services/AuthServices';
import AuthenticationContainer from '../components/AuthenticationContainer';
import { Redirect } from 'react-router-dom';
class LoginPage extends Component {
  state = {
    username: '',
    password: ''
  };

  snackBarRef = React.createRef();

  showSnackBar = message => {
    this.snackBarRef.current.openSnackBar(message);
  };

  onChangeUsername = e => {
    this.setState({ username: e.target.value });
  };

  onChangePassword = e => {
    this.setState({ password: e.target.value });
  };

  onClickLogin = () => {
    try {
      const { username, password } = this.state;
      if (username === 'admin' && password === 'kUEV2RLK3fd2MYxBqkEw') {
        setAccessToken('this_is_access_token');
        setUserData({ username: 'admin', role: 'admin' });
        notifyUpdate();
        this.showSnackBar('Login successfully');
      } else {
        return this.showSnackBar('Wrong username or password');
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { username, password } = this.state;
    return (
      <AuthenticationContainer>
        {({ isAuthenticated }) => {
          if (isAuthenticated) return <Redirect to="/a" />;

          return (
            <div className="LoginPage text-center">
              <div className="ImageBackground"></div>
              <div className="FormLogin">
                <h1>LOGWIN</h1>
                <form onSubmit={this.onClickLogin}>
                  <input
                    type="text"
                    placeholder="Username"
                    className="form-control"
                    value={username}
                    onChange={this.onChangeUsername}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    value={password}
                    onChange={this.onChangePassword}
                  />
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary btn-block"
                    onClick={this.onClickLogin}
                  >
                    Login
                  </button>
                </form>
              </div>
              <SnackBarComponent ref={this.snackBarRef} />
            </div>
          );
        }}
      </AuthenticationContainer>
    );
  }
}

export default LoginPage;
