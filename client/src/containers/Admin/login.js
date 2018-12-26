import React, { Component } from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions";

class Login extends Component {
  state = {
    email: "",
    password: "",
    error: "",
    success: false,
    redirectAction: {}
  };

  handleInputEmail = event => {
    this.setState({ email: event.target.value });
  };
  handleInputPassword = event => {
    this.setState({ password: event.target.value });
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props.user.login.isAuth)
      this.props.history.push("/user");
  }

  submitForm = e => {
    e.preventDefault();
    this.props.dispatch(loginUser(this.state));
  };

  render() {
    console.log(this.props);
    let user = this.props.user;
    return (
      <div className="rl_container">
        <form onSubmit={this.submitForm}>
          <h2>Login here</h2>
          <div className="form_element">
            <input
              type="email"
              placeholder="Enter your email"
              value={this.state.email}
              onChange={this.handleInputEmail}
            />
            <div>
              <input
                type="password"
                placeholder="Enter your password"
                value={this.state.password}
                onChange={this.handleInputPassword}
              />
            </div>

            <button type="submit"> Login </button>

            <div className="error">
              {user.login ? <div>{user.login.message}</div> : null}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Login);
