import React, {Component} from 'react';
import { connect } from 'react-redux';
import Page from './Page';
import Waypoint from 'react-waypoint';
import Question from './Question';
import FlowSignIn from './FlowSignIn';
import {Element, scroller} from 'react-scroll';
import LoadingScreen from './LoadingScreen';
import Comments from './Comments';
import Notification from './Notification';
{/* import CompareUsers from './CompareUsers.js' */}
import LogoutBtn from './LogoutBtn';
import store from '../store';
import IconButton from 'material-ui/IconButton';
import AddButton from 'material-ui/svg-icons/content/add-circle-outline';
import AvSkipnext from 'material-ui/svg-icons/av/skip-next';

import LinearProgress from 'material-ui/LinearProgress';

  

import './styles/Flow.css';

class Flow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focus: null,
      loading: true,
      noMoreQuestions: false,
      showComments: null,
      private: false,
      allQuestions: [],
      showingQuestions: [] // array of true/false values
    };
    this.questionUpdated = this.questionUpdated.bind(this);
    this.showComments = this.showComments.bind(this);
    this.commentsDidClose = this.commentsDidClose.bind(this);
    this.scrollToNextQuestion = this.scrollToNextQuestion.bind(this);
    this.togglePrivate = this.togglePrivate.bind(this);
    this.skipQuestion = this.skipQuestion.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // If recieving questions for the first time, hide loader

    if(nextProps.noQuestions) {
      this.setState({
        loading: false,
        noMoreQuestions: true
      })
    } else if(this.props.questions.length != nextProps.questions.length && nextProps.questions.length > this.state.allQuestions.length) {
      this.setState(function(curState) {
        return {
          loading: false,
          allQuestions: nextProps.questions,
          showingQuestions: curState.showingQuestions.length == 0 ? [nextProps.questions[0]] : curState.showingQuestions
        }
      }, function() {
        if(this.state.showingQuestions.length == 1) {
          scroller.scrollTo('question-0', {
            duration: 0,
            delay: 0,
            smooth: false,
            containerId: 'root',
          })
        }
      });
    }
    return true;
  }


  render() {
    let QuestionFlowStyle = {height: '100%'};

    return (
      <div className="QuestionFlow antiscroll-inner" style={QuestionFlowStyle}>

        {/* Should slow loading screen? */}
        <LoadingScreen loading={this.state.loading} />

        {/* Should show login page? */}
        {!this.props.Represent.API.authenticated() && [<Element name='login'></Element>,<FlowSignIn Represent={this.props.Represent} redirect={window.location.pathname} />]}

        {/* Should show comments page? */}
        {this.state.showComments ? (
          <Notification title="Comments" full={true} didClose={this.commentsDidClose}>
            <Comments questionId={this.state.showComments} Represent={this.props.Represent} />
          </Notification>
        ) : ''}


        <nav>
        <div className="nav-wrapper"> 

        {this.props.flowData &&
              // <div className="brand-logo" style={{'backgroundImage': 'url(\''+this.props.flowData.image+'\')'}}>
              //   {this.props.flowData.title}

             <img src={this.props.flowData.image} alt={this.props.flowData.title} className="brand-logo" />

              // </div>
          }

          {this.props.curUserProfile && (<ul className="right" id="nav-mobile">
            {/*<li>*/}
              {/*<img className="userPhoto" src={this.props.curUserProfile.photo} />*/}
            {/*</li>*/}
            <li>
              <span className="userName">{this.props.curUserProfile.first_name ? this.props.curUserProfile.first_name + ' '+this.props.curUserProfile.last_name : this.props.curUserProfile.username}</span>
              <br />
              <LogoutBtn API={this.props.Represent.API} onLogout={this.userLoggedOut}>Not you</LogoutBtn>
            </li> 
          </ul>)}
        </div>
        </nav>
        {(this.state.showingQuestions.map(function(question, index) {
          let focus = false;
          if(index === this.state.focus) {
            focus = true;
          }

          return (
            <div key={index} style={{minHeight: '100%', display: 'table', width: '100%'}} className={("faded ") + (focus ? 'focus' : '')}>
              <Element name={'question-' + index}></Element>
              <div style={{display: 'table-cell'  , verticalAlign: 'middle', width: '100%'}}>
                <Waypoint bottomOffset="30%" onEnter={() => this.handleWaypointEnter(index)}/>
                <Question onMouseOver={() => this.handleWaypointEnter(index)} question_data={question} questionUpdated={this.questionUpdated} Represent={this.props.Represent} private={this.state.private} login={this.scrollToLogin} showComments={this.showComments} API={this.props.Represent.API} />
              </div>
            </div>
          )
        }.bind(this)))}

        <Element name={'question-' + this.state.showingQuestions.length}></Element>
        <Page style={{textAlign: 'center'}}>
          <h1>Thank you for answering!</h1>
          {this.state.noMoreQuestions && <h1>You've answered all questions!</h1>}

          <button  className="clearfix m-y" onClick={() => window.open("http://represent.me" + window.location.pathname)}>View the results at represent.me</button>

          {this.props.currentFlowState && this.props.currentFlowState.flowType && this.props.currentFlowState.flowType == 'group' && this.props.curUserProfile && (<a href={'/group/'+this.props.currentFlowState.id+'/ask'} target="_self" className="clearfix">Submit a question</a>)}
  
          {/* 
          {this.props.curUserProfile && <CompareUsers userAId={this.props.curUserProfile.id} API={this.props.Represent.API}/>}
          */}
        </Page>



        <div className="Footer">

          <div className="FooterLeft">
            <div className="Logo left" onClick={() => window.open('http://represent.me' + window.location.pathname)}></div>
             
            {this.props.currentFlowState && this.props.curUserProfile && (<div>
            <span className="percentageCompleted"> <span>{this.props.currentFlowState.percentageCompleted}%</span> complete</span>
            <LinearProgress mode="determinate" value={this.props.currentFlowState.percentageCompleted} style={{width:'60%'}} /></div>)}

          </div> 

          <div className="FooterCenter hide-on-med-and-down">

            {this.props.curUserProfile && (
              <span className="FakeLink" onClick={this.togglePrivate}>{this.state.private ? 'Answering privately. Change?' : 'Answering publicly. Change?'}</span>
            )}
          </div>

          <div className="FooterRight">


            {this.props.currentFlowState && this.props.currentFlowState.flowType && this.props.currentFlowState.flowType == 'group' && this.props.curUserProfile && (

              <IconButton tooltip="skip" target="_self" href={'/group/'+this.props.currentFlowState.id+'/ask'}>
                <AddButton />
              </IconButton>

            )}

         
            <IconButton style={{marginLeft: '20px', marginRight: '20px'}} tooltip="skip" touch={true}  onClick={this.skipQuestion} >
              <AvSkipnext />
            </IconButton>

          </div>
        </div>
      </div>
    );
  }

  loadNextQuestions() {

  }

  userLoggedOut() {
    window.location.reload();
  }

  togglePrivate() {
    this.setState({
      private: !this.state.private
    });
  }

  showComments(question) {
    this.setState({
      showComments: question
    });
  }

  commentsDidClose() {
    this.setState({
      showComments: null
    });
  }

  handleWaypointEnter(index) {
    if(this.state.focus != index) {
      this.setState({
        focus: index
      });
    }
  }

  scrollToLogin() {
    scroller.scrollTo('login', {
      duration: 1000,
      delay: 0,
      smooth: true,
      containerId: 'root',
    })
  }

  scrollToNextQuestion() {
    let nextIndex = this.state.focus + 1;
    if(nextIndex == this.state.showingQuestions.length) {
      this.setState({
        showingQuestions: this.state.showingQuestions.concat(this.state.allQuestions[nextIndex] ? [this.state.allQuestions[nextIndex]] : [])
      }, function () {
        this.scrollToQuestion(nextIndex);
        if(this.state.allQuestions.length - this.state.showingQuestions.length < 2) {
          this.props.loadNextQuestions();
        }
      }.bind(this));
    } else {
      this.scrollToQuestion(nextIndex);
    }
  }

  skipQuestion() {
    if(!this.props.Represent.API.authenticated()) {
      scroller.scrollTo('login', {
        duration: 1000,
        delay: 0,
        smooth: true,
        containerId: 'root',
      });

      return false;
    }

    // Otherwise scroll to the next question and update question data

    this.scrollToNextQuestion();
  }

  scrollToQuestion(index) {
    scroller.scrollTo('question-' + ( index ), {
      duration: 1000,
      delay: 0,
      smooth: true,
      containerId: 'root',
    });
  }

  questionUpdated(id, response) {

    // If user isn't logged in, scroll to login box

    if(!this.props.Represent.API.authenticated()) {
      scroller.scrollTo('login', {
        duration: 1000,
        delay: 0,
        smooth: true,
        containerId: 'root',
      });

      return false;
    }

    // Otherwise scroll to the next question and update question data

    this.scrollToNextQuestion();
    this.props.onVoteChange(id, response);

    for (var i = 0; i < this.state.allQuestions.length; i++) {
      var q = this.state.allQuestions[i];
      if(q.id == id) {


        if(!q.my_vote || q.my_vote.length == 0) {
          store.dispatch({
            type: 'setPercentageCompletedInCurrentFlow',
            percentageCompleted: this.props.currentFlowState.questionsCount != 0 ? parseInt(((this.props.currentFlowState.answeredCount+1) / this.props.currentFlowState.questionsCount)*100) : 0,
            answeredCount: this.props.currentFlowState.answeredCount+1,
            questionsCount: this.props.currentFlowState.questionsCount
          })
        }
        break;
      }

    }

  }

}

const mapStateToProps = function(store) {
  return {
    curUserProfile: store.userState.curUserProfile,
    currentFlowState: store.currentFlowState
  };
};
export default connect(mapStateToProps)(Flow);
