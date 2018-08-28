import React, {Component} from 'react';
import store from './store';
import { connect } from 'react-redux';
import {Flow, Notification} from './components';

class GroupFlow extends Component {

  constructor() {
    super();
    this.state = {
      questions: [],
      noQuestions: null,
      focussed: false,
      groupJoinAcknowledged: false,
      joinedGroup: null,
      flowData: null,
      groupData: null
    };
    this.onVoteChange = this.onVoteChange.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.closeGroupSubscriptionWarning = this.closeGroupSubscriptionWarning.bind(this);
    this.loadNextQuestions = this.loadNextQuestions.bind(this);
  }

  componentWillMount() {

    // Request for the questions

    this.props.route.Represent.API.GETRequest('/api/next_question/', {
        group: parseInt(this.props.params.groupid, 10),
        limit_count: 2},
      function(response) {
        this.setState(function(curState) {
          return {
            questions: response.results,
            noQuestions: response.unanswered === 0
          }
        });
        if(this.props.curUserProfile) {
          let answeredCount = response.count-response.unanswered;
          store.dispatch({
            type: 'setPercentageCompletedInCurrentFlow',
            percentageCompleted: response.count !== 0
              ? parseInt((answeredCount / response.count)*100, 10) : 0,
            questionsCount: response.count,
            answeredCount: answeredCount
          });
        }
      }.bind(this),
      function(err) {
        if(err.status === 401) {
          this.props.route.Represent.API.logout(function(){
            window.location.reload();
          })
        }
      }.bind(this)

    );

    // End of request

    // Request if user is member of group


    this.props.route.Represent.API.GETRequest('/api/groups/' + this.props.params.groupid + '/', null, function(group_response) {
      this.setState({
        joinedGroup: this.props.route.Represent.API.authenticated() && !!group_response.my_membership,
        flowData: {
          type: 'group',
          title: group_response.name,
          image: group_response.image
        },
        groupData: group_response
      });
      store.dispatch({
        type: 'setCurrentFlowData',
        flowType: 'group',
        title: group_response.name,
        image: group_response.image,
        id: group_response.id,
        slug: group_response.slug
      });
    }.bind(this));

  }

  mouseOver() {
    if(!this.state.focussed) {
      this.setState({
        focussed: true
      });
    }
  }

  render() {
    return (
      <div style={{height: '100%'}} onMouseOver={this.mouseOver}>

        {this.showGroupSubscriptionWarning() ? (
          <Notification button="Got it" didClose={this.closeGroupSubscriptionWarning}>
            <p>By answering questions from {this.state.groupData.name}, you will automatically become a member. You can manage your membership at <a href={'https://represent.me/group/'+this.state.groupData.id+'/'+this.state.groupData.slug}>represent.me</a></p>
          </Notification>
        ) : ''}

        <Flow questions={this.state.questions} flowData={this.state.flowData} Represent={this.props.route.Represent} loadNextQuestions={this.loadNextQuestions} onVoteChange={this.onVoteChange} noQuestions={this.state.noQuestions} />
      </div>
    );
  }
//'votes__user__id__in!': this.props.curUserProfile ? this.props.curUserProfile.id : null,
  loadNextQuestions() {
    this.props.route.Represent.API.GETRequest('/api/next_question/', {
        group: parseInt(this.props.params.groupid, 10), limit_count: 2},
      function(response) {
        this.setState(function(curState) {
          return {
            questions: curState.questions.concat(response.results),
            noQuestions: response.length === 0
          }
        });
      }.bind(this),
      function(err) {
        if(err.status === 401) {
          this.props.route.Represent.API.logout(function(){
            window.location.reload();
          })
        }
      }.bind(this)

    );
  }


  closeGroupSubscriptionWarning() {
    this.setState({
      groupJoinAcknowledged: true
    });
  }

  showGroupSubscriptionWarning() {
    if(this.props.route.Represent.API.authenticated() && this.state.focussed && !this.state.groupJoinAcknowledged && !this.state.joinedGroup) {
      return true;
    }else {
      return false;
    }
  }

  onVoteChange(id, newvote) {
    let questions = this.state.questions;
    for( var i = 0, len = questions.length; i < len; i++ ) {
        if( questions[i]['id'] === id) {

          this.props.route.Represent.API.GETRequest('/api/questions/', {id: id}, function(response) {
              questions[i] = response.results[0];
              this.setState({
                questions: questions
              });
            }.bind(this),
          );

          break;

        }
    }

    // Join group

    if(!this.state.joinedGroup) {
      this.props.route.Represent.API.POSTRequest('/api/groups/' + this.props.params.groupid + '/join/', {}, function() {
        this.setState({
          joinedGroup: true
        });
      }.bind(this));
    }
  }

}

const mapStateToProps = function(store) {
  return {
    curUserProfile: store.userState.curUserProfile
  };
};
export default connect(mapStateToProps)(GroupFlow);
