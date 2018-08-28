import React, {Component} from 'react';
import store from './store';
import { connect } from 'react-redux';
import {Flow} from './components';

class ProfileAskedFlow extends Component {

  constructor() {
    super();
    this.state = {
      questions: [],
      noQuestions: null,
      flowData: null
    };

    this.onVoteChange = this.onVoteChange.bind(this);
  }

  componentWillMount() {

    // Request for the questions

    this.props.route.Represent.API.GETRequest(
      '/api/next_question/',
      {
        user__id: parseInt(this.props.params.profileid, 10),
        limit_count: 100
      },

      function(response) {
        this.setState({
          questions: response.results,
          noQuestions: response.results.length === 0
        });
        if(this.props.curUserProfile) {
          let answeredCount = response.count-response.unanswered;
          store.dispatch({
            type: 'setPercentageCompletedInCurrentFlow',
            percentageCompleted: response.count !== 0
              ? parseInt((answeredCount / response.count)*100, 10)
              : 0,
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

    this.props.route.Represent.API.GETRequest('/api/users/' + this.props.params.profileid + '/', null, function(profile_response) {
      let userName = profile_response.first_name ? profile_response.first_name + profile_response.last_name : profile_response.username;
      this.setState({
        flowData: {
          type: 'profile',
          title: userName,
          image: profile_response.photo
        }
      });
      store.dispatch({
        type: 'setCurrentFlowData',
        flowType: 'profile',
        title: userName,
        image: profile_response.photo,
        id: profile_response.id,
        slug: profile_response.username
      })
    }.bind(this));

  }

  render() {
    return (
      <div style={{height: '100vh'}}>
        <Flow questions={this.state.questions} flowData={this.state.flowData} Represent={this.props.route.Represent} onVoteChange={this.onVoteChange} noQuestions={this.state.noQuestions} />
      </div>
    );
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
  }

}


const mapStateToProps = function(store) {
  return {
    curUserProfile: store.userState.curUserProfile
  };
};
export default connect(mapStateToProps)(ProfileAskedFlow);
