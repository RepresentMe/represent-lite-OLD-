import React, { Component } from 'react';
import "./styles/LikertButton.css";
import LikertColour1 from './images/button_strongly_disagree.png';
import LikertColour2 from './images/button_disagree.png';
import LikertColour3 from './images/button_skip.png';
import LikertColour4 from './images/button_agree.png';
import LikertColour5 from './images/button_strongly_agree.png';

class LikertButton extends Component {

  render() {

    let correctColour = null;

    switch(this.props.value) {
      case 1:
        correctColour = LikertColour1;
        break;
      case 2:
        correctColour = LikertColour2;
        break;
      case 3:
        correctColour = LikertColour3;
        break;
      case 4:
        correctColour = LikertColour4;
        break;
      case 5:
        correctColour = LikertColour5;
        break;
      default:
        throw new Error("invalid colour " + correctColour);
    }

    return (
      <div className={"LikertButton"} onClick={() => this.props.onResponse(this.props.value)} style={{backgroundImage: 'url(' + correctColour + ')'}}></div>
      
    );
  }
}

export default LikertButton;
