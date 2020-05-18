import React, { Component } from "react";

class SnackBarComponent extends Component {
  state = {
    isActive: false,
    message: ""
  };

  openSnackBar = (message = "Something went wrong") => {
    this.setState({ isActive: true, message }, () => {
      setTimeout(() => {
        this.setState({ isActive: false });
      }, 3000);
    });
  };

  render() {
    const { isActive, message } = this.state;
    return (
      <div className={isActive ? "snackbar show" : "snackbar"}>{message}</div>
    );
  }
}

export default SnackBarComponent;
