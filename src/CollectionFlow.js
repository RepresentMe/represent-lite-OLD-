import React, {Component} from 'react';
import store from './store';
import { connect } from 'react-redux';
import {Flow} from './components';
import Slug from './Slug';

class CollectionFlow extends Component {

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

    this.props.route.Represent.API.GETRequest('/api/next_question/', {
        in_collections__parent: parseInt(this.props.params.collectionid, 10),
        limit_count: 100},
      function(response) {

        this.setState({
          questions: response.results,
          noQuestions: response.results.length === 0
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
        if(err.status === 401) {
          this.props.route.Represent.API.logout(function(){
            window.location.reload();
          })
        }
      }.bind(this)

    );

    // End of request

      this.props.route.Represent.API.GETRequest('/api/question_collections/' + this.props.params.collectionid + '/', null, function(collection_response) {
        this.setState({
          flowData: {
            type: 'collection',
            title: collection_response.name,
            image: collection_response.photo
          }
        });
        store.dispatch({
          type: 'setCurrentFlowData',
          flowType: 'collection',
          title: collection_response.name,
          image: collection_response.photo,
          id: collection_response.id,
          slug: Slug.slugify(collection_response.name)
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
export default connect(mapStateToProps)(CollectionFlow);
