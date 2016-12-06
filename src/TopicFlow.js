import React, {Component} from 'react';
import store from './store';
import { connect } from 'react-redux';
import {Flow, Notification} from './components';
import Slug from './Slug';

class TopicFlow extends Component {

  constructor() {
    super();
    this.state = {
      questions: [],
      noQuestions: null,
      focussed: false,
      topicFollowingAcknowledged: false,
      isFollowingTopic: null,
      flowData: null,
      topicData: null
    };
    this.onVoteChange = this.onVoteChange.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.closeTopicSubscriptionWarning = this.closeTopicSubscriptionWarning.bind(this);
  }

  componentWillMount() {

    // Request for the questions

    this.props.route.Represent.API.GETRequest('/api/next_question/', {tags__tag: parseInt(this.props.params.topicid, 10), limit_count: 100}, 
      function(response) {

        this.setState({
          questions: response.results,
          noQuestions: response.results.length == 0
        });
        if(this.props.curUserProfile) {
          let answeredCount = response.count-response.unanswered;
          store.dispatch({
            type: 'setPercentageCompletedInCurrentFlow',
            percentageCompleted: response.count != 0 ? parseInt((answeredCount / response.count)*100) : 0,
            questionsCount: response.count,
            answeredCount: answeredCount
          });
        }
      }.bind(this),
      function(err) {
        if(err.status == 401) {
          this.props.route.Represent.API.logout(function(){
            window.location.reload();
          })
        }
      }.bind(this)

    );

    // End of request

    // Request if user is member of group


    this.props.route.Represent.API.GETRequest('/api/tags/' + this.props.params.topicid + '/', null, function(tag_response) {
      this.setState({
        isFollowingTopic: this.props.route.Represent.API.authenticated() && !!tag_response.following,
        flowData: {
          type: 'topic',
          title: tag_response.text,
          image: tag_response.image
        },
        topicData: tag_response
      });
      store.dispatch({
        type: 'setCurrentFlowData',
        flowType: 'topic',
        title: tag_response.text,
        image: tag_response.image,
        id: tag_response.id,
        slug: Slug.slugify(tag_response.text)
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

        {this.showTopicSubscriptionWarning() ? (
          <Notification button="Got it" didClose={this.closeTopicSubscriptionWarning}>
            <p>By answering questions from {this.state.topicData.text} topic, you will automatically subscribe to it. You can manage your subscription at <a href={'https://represent.me/topic/'+this.state.topicData.id+'/'+Slug.slugify(this.state.topicData.text)}>represent.me</a></p>
          </Notification>
        ) : ''}

        <Flow questions={this.state.questions} flowData={this.state.flowData} Represent={this.props.route.Represent} onVoteChange={this.onVoteChange} noQuestions={this.state.noQuestions} />
      </div>
    );
  }

  closeTopicSubscriptionWarning() {
    this.setState({
      topicFollowingAcknowledged: true
    });
  }

  showTopicSubscriptionWarning() {
    if(this.props.route.Represent.API.authenticated() && this.state.focussed && !this.state.topicFollowingAcknowledged && !this.state.isFollowingTopic) {
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

    // Subscribe to topic

    if(!this.state.isFollowingTopic) {
      this.props.route.Represent.API.POSTRequest('/api/tags/' + this.props.params.topicid + '/follow/', {}, function() {
        this.setState({
          isFollowingTopic: true
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
export default connect(mapStateToProps)(TopicFlow);
