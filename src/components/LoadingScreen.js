import React, { Component } from 'react';
import "./styles/LoadingScreen.css";

import RepresentLogo from './images/represent_logo_cube.png';

class LoadingScreen extends Component {
  render() {
    return (
      <div className={"LoadingScreen " + (this.props.loading ? 'enabled' : 'disabled')}>
        <div className="LoadingInfo">
          <img src={RepresentLogo} className="animatedLoader" alt="Loading!" />
        </div>
      </div>
    );
  }
}

export default LoadingScreen;
