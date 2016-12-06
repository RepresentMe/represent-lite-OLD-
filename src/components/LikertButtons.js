import React, { Component } from 'react';
import LikertButton from './LikertButton.js';
import './styles/LikertButtons.css';

class LikertButtons extends Component {
  render() {

    var buttons = [];
    let answered = false;

    for (let i = 1; i <= 5; i++) {
      if(this.props.answer === i) {
        buttons[i] = (<div key={i} className="likertButtonContainer selected"><LikertButton value={i} onResponse={this.props.onResponse} /></div>);
      }else {
        if(this.props.updating === i) {
          buttons[i] = (<div key={i} className="likertButtonContainer updating"><LikertButton value={i} onResponse={this.props.onResponse} /></div>);
        }else {
          buttons[i] = (<div key={i} className="likertButtonContainer"><LikertButton value={i} onResponse={this.props.onResponse} /></div>);
        }
      }
    }

    if(this.props.answer !== null) {
      answered = true;
    }


    return (
      <div className={"LikertButtons " + (answered ? 'answered' : '')}>
        {buttons.map(function(button, index) {
          return button
        })}
      </div>
    );
  }
}

export default LikertButtons;
