import React, {Component} from 'react';

class LogoutBtn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logoutCompleted: !this.props.API.authenticated()
    };

    this.logout = this.logout.bind(this);
  }

  render() {
    return (
      <div>
        {this.state.logoutCompleted
          ? (<span>Logged out</span>)
          : (<a onClick={this.logout}>Not you?</a>)}
      </div>
    )
  }

  logout() {
    this.props.API.logout(function() {
      this.setState({
        logoutCompleted: true
      });
      this.props.onLogout();
    }.bind(this));
  }
}

export default LogoutBtn;