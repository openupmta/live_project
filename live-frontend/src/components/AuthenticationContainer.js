import { Component } from "react";
import {
  isAuthenticated,
  getUserData,
  subscribe,
  unsubscribe
} from "../services/AuthServices";

class AuthenticationContainer extends Component {
  state = {
    isAuthenticated: isAuthenticated(),
    user: getUserData()
  };

  componentDidMount() {
    subscribe(this._handleAuthChange);
  }

  componentWillUnmount() {
    unsubscribe(this._handleAuthChange);
  }

  _handleAuthChange = () => {
    this.setState({
      isAuthenticated: isAuthenticated(),
      user: getUserData()
    });
  };

  render() {
    return this.props.children(this.state);
  }
}

export default AuthenticationContainer;
