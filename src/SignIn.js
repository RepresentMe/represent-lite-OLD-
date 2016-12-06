import React, { Component } from 'react';
import t from 'tcomb-form';
import { Page, FacebookLogin } from './components';
import { browserHistory } from 'react-router'

var Form = t.form.Form;

class SignIn extends Component {

  constructor() {
    super();
    this.state = {
      formValue: {},
      error: null
    }

    this.SignInTypeOptions = {
      fields: {
        password: {
          type: 'password'
        }
      }
    };

    this.SignInType = t.struct({
      emailAddress: t.String,
      password: t.Str
    });

    this.onFormChange = this.onFormChange.bind(this);
    this.signIn = this.signIn.bind(this);
    this.navigateNext = this.navigateNext.bind(this);
    this.facebookCallback = this.facebookCallback.bind(this);
  }

  render() {
    return (
      <Page > 
        <div >
        <div className="Question p-a card z-depth-1">
         
          <div className="card-text p-a">
            <FacebookLogin
            forceRedirect={true}
            appId={this.props.route.Represent.facebookAppId}
            fields="name,email,picture"
            callback={this.facebookCallback}
            cssClass="facebook"
            textButton="Connect with Facebook" />

            <button onClick={() => browserHistory.push(window.location.pathname.replace('signin', 'register'))} style={{float: 'right', fontWeight:'200'}} className="secondary">{"I don't have an account"}</button>
          </div>

          <div className="card-action">           
            <p style={{color: '#999'}}>Or sign in using your email</p>
            <Form
              ref="form"
              type={this.SignInType}
              options={this.SignInTypeOptions}
              value={this.state.formValue}
              onChange={this.onFormChange}
            />
            <button onClick={this.signIn}>Sign In</button>
            {/*}<button className="google">Google</button>*/}

           </div> 
        
        {this.state.error ? (<div style={{color: 'red'}}>
          <p>{this.state.error}</p>
        </div>) : ''}

        </div>
        </div>
          <p className="small">Represent is people-first democracy platform which lets you have your say, find and choose the best representatives, take action, and evolve democracy</p>
           
      </Page>
    )
  }

  signIn() {

    if(!this.state.formValue.emailAddress) {
      this.setState({
        error: 'You must enter a valid email address'
      });
    }else if(!this.state.formValue.password) {
      this.setState({
        error: 'You must enter a valid password'
      });
    }else {
      this.props.route.Represent.API.POSTRequest('/auth/login/', {username: this.state.formValue.emailAddress, password: this.state.formValue.password}, function(result) {
        this.props.route.Represent.API.authenticateLocalStorage(result.auth_token, function() {
          this.navigateNext();
        }.bind(this));
      }.bind(this), function(result) {
        this.setState({
          error: 'Please check your details and try again'
        });
      }.bind(this));
    }
  }

  onFormChange(newForm) {
    this.setState({
      formValue: newForm
    });
  }

  facebookCallback(data) {
    this.props.route.Represent.API.POSTRequest('/auth-yeti/', {provider: 'facebook', access_token: data.accessToken} , function(result) {
      this.props.route.Represent.API.authenticateLocalStorage(result.auth_token, function() {
        this.navigateNext();
      }.bind(this));
    }.bind(this));
  }

  navigateNext() {
    if(this.props.params.redirect) {
      browserHistory.push(decodeURIComponent(this.props.params.redirect));
    }else {
      browserHistory.push('/');
    }
  }

}

export default SignIn;
