import React, { Component } from 'react';
import "./styles/CommentVote.css";

class CommentVote extends Component {

  constructor() {
    super();
    this.state = {
      stat: null,
      userVotedUp: null,
      userVotedDown: null
    }

    this.voteUp = this.voteUp.bind(this);
    this.voteDown = this.voteDown.bind(this);
  }

  componentWillMount() {
    let userVotedUp = false;
    let userVotedDown = false;

    if(this.props.commentObj.my_vote.length > 0) {
      if(this.props.commentObj.my_vote[0].value === 5) {
        userVotedUp = true;
      }else if(this.props.commentObj.my_vote[0].value === 1) {
        userVotedDown = true;
      }
    }

    this.setState({
      stat: this.props.commentObj.direct_maximum - this.props.commentObj.direct_minimum,
      userVotedUp: userVotedUp,
      userVotedDown: userVotedDown
    });
  }

  render() {

    return (
      <div className="CommentVote">
        <div className={"CommentVoteUp " + (this.state.userVotedUp ? 'selected' : '')} onClick={this.voteUp}>+</div>
        <div className="CommentVoteStat">{this.state.stat}</div>
        <div className={"CommentVoteDown " + (this.state.userVotedDown ? 'selected' : '')} onClick={this.voteDown}>&mdash;</div>
      </div>
    );
  }

  voteUp() {
    this.props.Represent.API.POSTRequest('/api/comment_votes/', {object_id: this.props.commentObj.id, value: 5}, function(result) {
      this.setState({
        stat: result.direct_maximum - result.direct_minimum,
        userVotedUp: true,
        userVotedDown: false
      });
    }.bind(this))
  }

  voteDown() {
    this.props.Represent.API.POSTRequest('/api/comment_votes/', {object_id: this.props.commentObj.id, value: 1}, function(result) {
      this.setState({
        stat: result.direct_maximum - result.direct_minimum,
        userVotedDown: true,
        userVotedUp: false
      });
    }.bind(this))
  }

}

export default CommentVote;
