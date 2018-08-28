import React, {Component} from 'react';
import {Notification} from './components';
import FlowSignIn from './components/FlowSignIn';
import SearchTags from './components/SearchTags';
import {Element, scroller} from 'react-scroll';
import { withRouter } from 'react-router';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Page from './components/Page';
import './components/styles/AddQuestionFlow.css';

class AddQuestionFlow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionTitle: '',
      primaryTag: 1,
      tags: [],
      showNotificationBlock: false,
      showPrimaryTagSel: false,
      showTagsSel: false,
      showSubmitBtn: false,
      addingInProcess: false
    };

    this.askClicked = this.askClicked.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePrimaryTagChange = this.handlePrimaryTagChange.bind(this);
    this.handleTagAdded = this.handleTagAdded.bind(this);
    this.goToGroupPage = this.goToGroupPage.bind(this);
  }

  componentDidMount() {
    scroller.scrollTo('askCard', {
      duration: 0,
      delay: 0,
      smooth: false,
      containerId: 'root',
    });
  }

  render() {
    return (
      <div className="AddQuestionFlow">
        {!this.props.route.Represent.API.authenticated() && (<div><Element name='login' /> <FlowSignIn Represent={this.props.Represent} redirect={window.location.pathname} /></div>)}

        {this.state.showNotificationBlock && (<Notification button="Yes" didClose={this.saveQuestion}>
          <p>Are you sure you'd like to submit this?</p>
          <p style={{fontWeight: 'bold'}}>{this.state.questionTitle}</p>
        </Notification>)}

        <div><Element name='askCard' />
          <div className="hasBg">
            <Page style={{height: '100vh', color: '#000000', backgroundColor: '#ffffff', position: 'relative'}} >
              <div className="Question p-a card z-depth-1">

                <div className="card-text p-a">
                  What's your question?
                  <div><TextField
                    value={this.state.questionTitle}
                    onChange={this.handleInputChange}
                    autoFocus
                    fullWidth={true}
                  /></div>

                  {this.state.showPrimaryTagSel && <div className="primaryTagSel"><SelectField
                    value={this.state.primaryTag}
                    maxHeight={200}
                    onChange={this.handlePrimaryTagChange}>
                    <MenuItem value={1} primaryText="Select a category" disabled={true} />
                    <MenuItem value={65} primaryText="Democracy" />
                    <MenuItem value={37} primaryText="Economy" />
                    <MenuItem value={25} primaryText="Education" />
                    <MenuItem value={12} primaryText="Environment" />
                    <MenuItem value={453} primaryText="Immigration" />
                    <MenuItem value={743} primaryText="Investment" />
                    <MenuItem value={84} primaryText="Jobs" />
                    <MenuItem value={485} primaryText="Laws" />
                    <MenuItem value={60} primaryText="NHS" />
                    <MenuItem value={780} primaryText="Rights" />
                    <MenuItem value={18} primaryText="Society" />
                    <MenuItem value={51} primaryText="Trade" />
                    <MenuItem value={749} primaryText="Travel" />
                    <MenuItem value={272} primaryText="Voting" />
                    <MenuItem value={388} primaryText="Work" />
                  </SelectField></div>}

                  {this.state.showTagsSel && (<div className="searchTags">
                    <SearchTags API={this.props.route.Represent.API} onTagAdded={this.handleTagAdded} />
                    <div className="tags">
                      {this.state.tags.map(function(tag) {
                        return (
                          <span className="tag" key={tag.id}>
                            {tag.text}
                          </span>
                        )
                      })}
                    </div>
                  </div>)}
                  <div>
                    {this.state.showSubmitBtn && (<button onClick={this.askClicked}>
                      {this.state.addingInProcess ? 'Adding...' : 'Submit my question'}
                      </button>
                    )}
                    <button onClick={this.goToGroupPage}>Cancel</button>
                  </div>

                </div>
              </div>
            </Page>
          </div>
        </div>
      </div>
    )
  }

  askClicked() {
    if(this.state.addingInProcess) return;
    this.setState({
      showNotificationBlock: true
    })
  }

  saveQuestion() {
    this.setState({
      showNotificationBlock: false,
      addingInProcess: true
    });

    let tags = [];
    this.state.tags.forEach(function(tag) {
      tags.push({tag: {id:tag.id}});
    });

    let qReqObj = {
      question: this.state.questionTitle,
      tags:tags,
      topic: this.state.primaryTag,
      group: this.props.params.groupid
    };
    this.props.route.Represent.API.POSTRequest('/api/questions/', qReqObj, function(res) {
      this.goToGroupPage();
    }.bind(this))

  }

  handleInputChange(e) {
    if(!this.props.route.Represent.API.authenticated()) {
      return this.scrollToLogin();
    }
    let showPrimaryTagSel = false;
    if(e.target.value && e.target.value.length >= 3) {
      showPrimaryTagSel = true;
    }
    this.setState({
      questionTitle: e.target.value,
      showPrimaryTagSel: showPrimaryTagSel
    });

  }

  handlePrimaryTagChange(e, i, value) {
    console.log('primaryTag', value);
    this.setState({
      primaryTag: value,
      showTagsSel: true
    });

    setTimeout(function() {
      this.setState({
        showSubmitBtn: true
      });
    }.bind(this), 500)
  }

  handleTagAdded(tag) {
    this.setState(function(prevState, props) {
      return {
        tags: [...prevState.tags, tag]
      }
    })
  }

  scrollToLogin() {
    scroller.scrollTo('login', {
      duration: 1000,
      delay: 0,
      smooth: true,
      containerId: 'root',
    })
  }

  goToGroupPage() {
    this.props.router.push('/group/'+this.props.params.groupid);
  }
}



export default withRouter(AddQuestionFlow);
