import React, { Component } from 'react';
//import LikertButton from './LikertButton';
import CommentVote from './CommentVote';
import './styles/LikertButtons.css';
import ProfilePlaceholder from './images/profile_placeholder.png';
//import IconReply from './images/icon-reply.png';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: props.commentObj
    }
  }

  render() {

    let colour = {
      reason: '#F88C84',
      info: '#9384F8',
      solution: '#F8CE84'
    }

    let subtypeColour = null;

    switch(this.props.commentObj.subtype) {
      case 'reason':
        subtypeColour = colour.reason;
        break;
      case 'info':
        subtypeColour = colour.info;
        break;
      case 'suggestion':
        subtypeColour = colour.solution;
        break;
    }

    let vote = null;

    if(this.props.commentObj.vote.length > 0) {
      switch(this.props.commentObj.vote[0].value) {
        case 1:
          vote = 'Strongly Disagree';
          break;
        case 2:
          vote = 'Disagree';
          break;
        case 3:
          vote = 'Neutral';
          break;
        case 4:
          vote = 'Agree';
          break;
        case 5:
          vote = 'Strongly Agree';
          break;
      }
    }

    return (
      <div className={"Comment " + (this.props.commentObj.parent && 'CommentReply')}>
        <CommentVote commentObj={this.props.commentObj} Represent={this.props.Represent} />

        <div>
          <div className="commentLabels">
            <div className="photo">
              <img src={this.props.commentObj.user.photo} onError={function(e) {e.target.src = ProfilePlaceholder}} />
            </div>
            <div className="Label attachedLeft">{this.state.comment.user.first_name} {this.state.comment.user.last_name}</div>
            {vote ? <div className="Label minimal">{vote}</div> : <div className="Label minimal">Private</div>}
            <div className="Label minimal" style={{color: subtypeColour, borderColor: subtypeColour, float: 'right'}}>{this.props.commentObj.subtype.charAt(0).toUpperCase() + this.props.commentObj.subtype.slice(1)}</div>
          </div>

          <div>
            {this.state.comment.text}<br/>
            {!this.props.commentObj.parent && <div className="FakeLink" onClick={() => this.props.onReply(this.props.commentObj)}>{/*<img src={IconReply} />*/}Reply</div>}
          </div>
        </div>
      </div>
    );
  };


}

export default Comment;
