import React, {Component} from 'react';
import LinearProgress from 'material-ui/LinearProgress';

class QuestionResultsBars extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: this.props.questionObj,
      resultsBarsData: [],
      isMCQ: this.props.questionObj.choices && this.props.questionObj.choices.length > 0
    }
  }

  componentWillMount() {
    let question = this.state.question;
    let checkCurUserVote = this.props.API.authenticated() && question.my_vote && question.my_vote.length > 0;

    var barsData = [];
    if(this.state.isMCQ) {
      question.choices.forEach(function(choice) {
        barsData.push({
          title: choice.text,
          percentageAnswered: parseInt((choice.liquid_vote_count/question.liquid_vote_count)*100, 10),
          isCurUserAnswered: checkCurUserVote && question.my_vote[0].object_id === choice.id,
          color: '#C6C7CA'
        })
      })
    } else {
      barsData.push({
        title: 'Strongly disagree',
        percentageAnswered: parseInt((question.liquid_minimum/question.liquid_vote_count)*100, 10),
        isCurUserAnswered: checkCurUserVote && question.my_vote[0].value === 1,
        color: '#F43829'
      });
      barsData.push({
        title: 'Disagree',
        percentageAnswered: parseInt((question.liquid_low/question.liquid_vote_count)*100, 10),
        isCurUserAnswered: checkCurUserVote && question.my_vote[0].value === 2,
        color: '#F98375'
      });
      barsData.push({
        title: 'Neutral',
        percentageAnswered: parseInt((question.liquid_medium/question.liquid_vote_count)*100, 10),
        isCurUserAnswered: checkCurUserVote && question.my_vote[0].value === 3,
        color: '#C6C7CA'
      });
      barsData.push({
        title: 'Agree',
        percentageAnswered: parseInt((question.liquid_high/question.liquid_vote_count)*100, 10),
        isCurUserAnswered: checkCurUserVote && question.my_vote[0].value === 4,
        color: '#85CA66'
      });
      barsData.push({
        title: 'Strongly agree',
        percentageAnswered: parseInt((question.liquid_maximum/question.liquid_vote_count)*100, 10),
        isCurUserAnswered: checkCurUserVote && question.my_vote[0].value === 5,
        color: '#4AB246'
      })
    }
    this.setState({
      resultsBarsData: barsData
    })
  }

  render() {
    return (
      <div>
        {this.state.resultsBarsData.map(function(barData) {
          return (
            <div>
              {barData.title}
              <LinearProgress mode="determinate" color={barData.color} value={barData.percentageAnswered} />
            </div>
          )
        })}
      </div>
    )
  }
}

export default QuestionResultsBars;
