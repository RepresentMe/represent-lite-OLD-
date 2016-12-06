import React, { Component } from 'react';
import { connect} from 'react-redux';
import store from './store';
import EmbedGenerator from './EmbedGenerator.js';
import GroupFlow from './GroupFlow.js';
import TopicFlow from './TopicFlow.js';
import CollectionFlow from './CollectionFlow.js';
import ProfileAnsweredFlow from './ProfileAnsweredFlow.js';
import ProfileAskedFlow from './ProfileAskedFlow.js';
import GroupTagFlow from './GroupTagFlow.js';
import AddQuestionFlow from './AddQuestionFlow.js';
import SignIn from './SignIn';
import Register from './Register';
import Iframe from './components/Iframe';   
import { Router, Route, browserHistory } from 'react-router';
import RepresentAPI from './RepresentAPI';
import ReactGA from 'react-ga';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

class App extends Component {

  constructor() {
    super();

    // set current user data
    let curUser = JSON.parse(localStorage.getItem('user')) || null;
    store.dispatch({
      type: 'updateCurUserProfile',
      userProfile: curUser
    });
    curUser && window.analytics.identify(curUser.username, curUser);
    // Google analytics
    ReactGA.initialize('UA-59994709-1');

    let facebookAppId = null;
    if (location.host === 'represent.me' || location.host === 'share.represent.me') { // live
      facebookAppId = '1499361770335561';
    } else if (location.host === 'test.represent.me') { // test
      facebookAppId = '1529695427302195';
    } else { // local
      facebookAppId = '1665890767015993';
    }

    let baseColor = this.findGetParameter('baseColor') || 'ffffff';
    let textColor = this.findGetParameter('textColor') ||  '000000';

    let showComments = false;
    if(this.findGetParameter('showComments') === 'true') {
      showComments = true;
    }

    let maxHeight = this.findGetParameter('maxHeight');
    if(maxHeight) {
      document.getElementById('root').style.height = maxHeight + 'px';
    }else {
      document.getElementById('root').style.height = '100vh';
    }

    let stylesheet = this.findGetParameter('stylesheet');
    if(stylesheet) {
      var lnk=document.createElement('link');
      lnk.href=stylesheet;
      lnk.rel='stylesheet';
      lnk.type='text/css';
      (document.head||document.documentElement).appendChild(lnk);
    }

    this.state = {
      Represent: {
        API: new RepresentAPI(),
        findGetParameter: this.findGetParameter,
        facebookAppId: facebookAppId,
        baseColor: baseColor,
        textColor: textColor,
        showComments: showComments,
        convertHex: this.convertHex
      }
    };

    // routes are separated here because of an error "You cannot change <Router routes>; it will be ignored". Details: http://stackoverflow.com/questions/34760825/react-route-react-hot-loader-webpack-you-cannot-change-router-routes-it-will
    let Represent = this.state.Represent;
    this.routes = (<Route path="/"><Route path="/generate(/**)" component={EmbedGenerator} />
      <Route path="/group/:groupid/tag/:tagid(/**)" component={GroupTagFlow} Represent={Represent} />
      <Route path="/iframe" component={Iframe} Represent={Represent} />
      <Route path="/group/:groupid/ask" component={AddQuestionFlow} Represent={Represent} />
      <Route path="/group/:groupid(/**)" component={GroupFlow} Represent={Represent} />
      <Route path="/topic/:topicid(/**)" component={TopicFlow} Represent={Represent} />
      <Route path="/collection/:collectionid(/**)" component={CollectionFlow} Represent={Represent} />
      <Route path="/profile/:profileid/answered(/**)" component={ProfileAnsweredFlow} Represent={Represent} />
      <Route path="/profile/:profileid/asked(/**)" component={ProfileAskedFlow} Represent={Represent} />
      <Route path="/signin(/:redirect)" component={SignIn} Represent={Represent} />
      <Route path="/register(/:redirect)" component={Register} Represent={Represent} /></Route>);
  }

  componentWillMount() {
    if(this.findGetParameter('baseColor')) {
      document.body.style.backgroundColor = '#' + this.state.Represent.baseColor;
    }

    if(this.findGetParameter('textColor')) {
      document.body.style.color = '#' + this.state.Represent.textColor;
    }

    injectTapEventPlugin();
  }

  render() {
    return (
      <MuiThemeProvider>
        <div id={this.props.currentFlowState.slug+"_"+this.props.currentFlowState.id} style={{height: '100%'}}>
          <Router history={browserHistory} onUpdate={this.logPageView}>
            {this.routes}
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }

  logPageView() {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }

  findGetParameter(parameterName) {
    //Helper function to retrieve GET values from the URL
    var result = null,
      tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
      tmp = items[index].split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
  }

  convertHex(hex,opacity) {
    if(!hex) {
      return null
    }

    let r = parseInt(hex.substring(0,2), 16);
    let g = parseInt(hex.substring(2,4), 16);
    let b = parseInt(hex.substring(4,6), 16);

    let result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
  }

}

const mapStateToProps = function(store) {
  return {
    currentFlowState: store.currentFlowState
  };
};
export default connect(mapStateToProps)(App);
