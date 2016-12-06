import React, { Component } from 'react';

import LikertButtons from './LikertButtons';
import MCQButtons from './MCQButtons';
import QuestionResultsBars from './QuestionResultsBars';
import $ from 'jquery';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import FlatButton from 'material-ui/FlatButton';
import './styles/Question.css';



class Question extends Component {

  constructor() {
    super();
    this.state = {
      updating: null,
      showComments: false
    };

    this.updateQuestion = this.updateQuestion.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(JSON.stringify(this.state) !== JSON.stringify(nextState)) {
      return true;
    }

    // Compare last answer vs next answer

    if(JSON.stringify(this.props.question_data.my_vote) === JSON.stringify(nextProps.question_data.my_vote)) {
      return false;
    }else {
      console.log('updating');
      return true;
    }

  }

  render() {

    let likert = true;
    let mcqchoices = [];
    let answer = null;

    if(this.props.question_data.my_vote.length > 0) {
      if(this.props.question_data.subtype === 'likert') {
        answer = this.props.question_data.my_vote[0].value;
      }else if(this.props.question_data.subtype === 'mcq') {
        answer = this.props.question_data.my_vote[0].object_id;
      }
    }

    if(this.props.question_data.subtype === 'mcq') {
      likert = false;
      $.each(this.props.question_data.choices, function(index_choice, choice) {
        mcqchoices.push({id: choice.id, text: choice.text});
      });
    }

    return (
      <div>
        <div className="Question card z-depth-3" onMouseOver={this.props.onMouseOver}>
         {/* <div className="clearfix moreActions"> 
            <IconMenu className="right "
              iconButtonElement={<IconButton><KeyboardArrowDown /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              iconStyle="color:#ccc;"
            > 
              <MenuItem primaryText="Comments"  />
              <MenuItem primaryText="Answer privately" /> 
            </IconMenu>
          </div> */}
          <div className="title card-text valign-wrapper">
            <span className="valign">{this.props.question_data.question}</span>
          </div>
          <div className="card-action">
            {likert ? <LikertButtons onResponse={this.updateQuestion} answer={answer ? answer : null}/> : <MCQButtons answer={answer ? answer : null} MCQChoices={mcqchoices} onResponse={this.updateQuestion} />}
          </div>

          {this.props.Represent.showComments &&
            <div style={{textAlign: 'center', height: '0px'}}>
              <p style={{marginTop: '10px'}}><span className="FakeLink" onClick={() => this.props.showComments(this.props.question_data.id)}>comments</span></p>
            </div>
          }

        </div>
 
        {/*{this.props.question_data && <QuestionResultsBars questionObj={this.props.question_data} API={this.props.API} />}*/}
      </div>
    );
  }

 





  updateQuestion(response) {

    // If user not authenticated, skip

    if(!this.props.Represent.API.authenticated()) {
      this.props.questionUpdated(false, false)
      return;
    }

    // Else continue to register vote

    this.setState({
      updating: response
    });

    let object_id = null;
    let value = null;
    let url = null;

    if(this.props.question_data.subtype === 'likert') {
      object_id = this.props.question_data.id;
      value = response;
      url = '/api/question_votes/';
    }else if(this.props.question_data.subtype === 'mcq') {
      object_id = response;
      value = 5;
      url = '/api/question_choice_votes/';
    }

    // Network update question response

    this.props.Represent.API.POSTRequest(
      url,
      {value: value, object_id: object_id, private: this.props.private},
      function(question_data) {
        this.props.questionUpdated(this.props.question_data.id, question_data);
      }.bind(this),
      function(question_data) {
        this.props.login();
      }.bind(this)
    );

  }

}

export default Question;
