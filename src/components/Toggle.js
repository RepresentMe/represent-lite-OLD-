import React, { Component } from 'react';
import "./styles/Toggle.css";
import True from './images/checkbox-true.svg';
import False from './images/checkbox-false.svg';

class Toggle extends Component {
  render() {
    return (
      <div className={'Toggle ' + (this.props.state ? 'True ' : 'False ') + (this.props.size ? this.props.size : '')} style={this.props.color && {borderColor: this.props.color, color: this.props.color}} onClick={this.props.onToggle}>
      <div className={'ToggleText'}>{this.props.text}</div>
        <div className={'ToggleIcon'} style={this.props.color && {borderColor: this.props.color}}>
          {this.props.state ? <img src={True} alt="" /> : <img src={False} alt="" />}
        </div>
      </div>
    );
  }
}

export default Toggle;
