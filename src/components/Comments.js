import React, { Component } from 'react';
import Comment from './Comment.js';
import Toggle from './Toggle.js';
import './styles/Comments.css';
import FlipMove from 'react-flip-move';
import $ from 'jquery';
import {Element, scroller} from 'react-scroll';
// import './styles/Comm.css';

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: null,
      filterReasons: true,
      filterInformation: true,
      filterSolutions: true,
      addReply: null,
      addText: '',
      addType: 'none',
      addError: ''
    };
    this.toggleFilter = this.toggleFilter.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.onReply = this.onReply.bind(this);
    this.saveComment = this.saveComment.bind(this);
  }

  componentWillMount() {
    this.getComments();
  }

  render() {

    return (
      <div className="Comments">

        <div className='toggleFilters'>
          <div style={{verticalAlign: 'top', marginTop: '5px', display: 'inline-block', marginRight: '10px'}}>Filter comments: </div>
          <Toggle text="Reasons" state={this.state.filterReasons} color="#F88C84" onToggle={() => this.toggleFilter('reasons')}/>
          <Toggle text="Information" state={this.state.filterInformation} color="#9384F8" onToggle={() => this.toggleFilter('information')}/>
          <Toggle text="Solutions" state={this.state.filterSolutions} color="#F8CE84" onToggle={() => this.toggleFilter('solutions')}/>
        </div>

        <div>
          <FlipMove enterAnimation="fade" leaveAnimation="fade" maintainContainerHeight={true}>

          { this.state.comments && this.state.comments.map(function(comment, i) {
              switch(comment.subtype) {
                case 'reason':
                  if(!this.state.filterReasons) return null;
                  break;
                case 'info':
                  if(!this.state.filterInformation) return null;
                  break;
                case 'suggestion':
                  if(!this.state.filterSolutions) return null;
                  break;
              }
              return (<Comment onReply={this.onReply} key={i} commentObj={comment} Represent={this.props.Represent} />)
            }.bind(this))
          }
          </FlipMove>

          <div className="AddComment" ref="AddComment">

            <textarea value={this.state.addText} onChange={this.handleTextChange} placeholder="My comment..." />

            <div>
              <button onClick={this.saveComment}>Add Comment</button>
              {this.state.addReply ? <Toggle size="large" text={"Replying to " + this.state.addReply.user.first_name} color="#27829F" state={true} onToggle={() => this.onReply(null)}/> : (
              <select value={this.state.addType} onChange={this.handleTypeChange}>
                <option disabled value="none">Type...</option>
                <option value="info">Info</option>
                <option value="reason">Reason</option>
                <option value="suggestion">Suggestion</option>
              </select>
              )}
            </div>

            <div style={{color: 'red', marginTop: '10px'}}>
              {this.state.addError}
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleTypeChange(e) {
    this.setState({addType: e.target.value});
  }

  handleTextChange(e) {
    this.setState({addText: e.target.value});
  }

  onReply(commentObj) {
    this.setState({
      addReply: commentObj
    });

    if(commentObj != null) {
      console.log('test');
      this.refs.AddComment.scrollIntoView();
    }
  }

  saveComment() {

    let objectId = null;
    let subtype = null;

    if(this.state.addText === '') {
      this.setState({
        addError: 'You forgot to write your comment!'
      });
      return;
    }

    if(this.state.addReply) {
      objectId = this.state.addReply.id;
      subtype = this.state.addReply.subtype;
    }else {

      if(this.state.addType === 'none') {
        this.setState({
          addError: 'Please select which type of comment you are submitting'
        });
        return;
      }

      subtype = this.state.addType;
    }

    this.props.Represent.API.POSTRequest('/api/comments/', {
      text: this.state.addText,
      question: this.props.questionId,
      subtype: subtype,
      parent: objectId
    }, function(response) {

      this.setState({
        comments: [],
        addReply: null,
        addText: '',
        addType: 'none',
        addError: ''
      }, function() {
        this.getComments();
      }.bind(this));

    }.bind(this));

  }

  toggleFilter(filter) {
    switch(filter) {
      case 'reasons':
        this.setState({filterReasons: !this.state.filterReasons});
        break;
      case 'information':
        this.setState({filterInformation: !this.state.filterInformation});
        break;
      case 'solutions':
        this.setState({filterSolutions: !this.state.filterSolutions});
        break;
    }
  }

  getComments() {
    this.props.Represent.API.GETRequest('/api/comments/', {question: this.props.questionId}, function(response) {
      let comments = [];
      $.each(response.results.reverse(), function(comment_index, comment) {
        if(!comment.parent) {
          // If comment is top level, iterate through children
          comments.push(comment);
          $.each(response.results, function(comment_index_inner, comment_inner) {
            if(comment_inner.parent === comment.id) {
              let comment_reply = comment_inner;
              comment_reply.parent_name = comment.user.first_name;
              comments.push(comment_reply);
            }
          });
        }
      });
      this.setState({comments: comments});
    }.bind(this));
  }
}

export default Comments;
