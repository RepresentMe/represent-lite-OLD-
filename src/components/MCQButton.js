import React, { Component } from 'react';
import './styles/MCQButton.css';

class MCQButton extends Component {
  render() {

    return (
      <div className={"MCQButton " + (this.props.selected ? '' : 'selected')} onClick={() => this.props.onResponse(this.props.id)}>{this.props.text}</div>
    );
  }
}

export default MCQButton;
