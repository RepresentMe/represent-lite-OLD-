import React, { Component } from 'react';
import MCQButton from './MCQButton.js';
import './styles/MCQButtons.css';

class MCQButtons extends Component {
  render() {

    return (
      <div>
        {this.props.MCQChoices.map(function(choice, index){
          if(this.props.answer === choice.id) {
            return (<MCQButton selected={false} key={index} id={choice.id} text={choice.text} onResponse={this.props.onResponse} />);
          }else {
            return (<MCQButton selected={true} key={index} id={choice.id} text={choice.text} onResponse={this.props.onResponse} />);
          }
        }.bind(this))}
      </div>
    );
  }
}

export default MCQButtons;
