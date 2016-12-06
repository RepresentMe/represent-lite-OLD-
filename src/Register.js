import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import { Page, FacebookLogin } from './components';
import * as EmailValidator from 'email-validator';
import { browserHistory } from 'react-router';
import Autocomplete from 'react-google-autocomplete';
import RaisedButton from 'material-ui/RaisedButton';

import './components/styles/Register.css';

class Register extends Component {

  constructor() {
    super();

    const minDate = new Date();
    const maxDate = new Date(); 
    minDate.setFullYear(minDate.getFullYear() - 120);
    minDate.setHours(0, 0, 0, 0);
    maxDate.setFullYear(maxDate.getFullYear() - 13);
    maxDate.setHours(0, 0, 0, 0);
   
    this.state = {

      minDate: minDate,
      maxDate: maxDate,
      formValues: {
        email: '',
        password: '',
        username: '',
        dob: null,
        gender: false,
        location: null,
        tou: false,
      },
      formErrors: {
        email: null,
        password: null,
        username: null
      },
      error: null
    };

    this.register = this.register.bind(this);
    this.facebookCallback = this.facebookCallback.bind(this);
    this.navigateNext = this.navigateNext.bind(this);
    this.registerErrorObjToStr = this.registerErrorObjToStr.bind(this);

    this.setError = this.setError.bind(this);
    this.setValue = this.setValue.bind(this);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeDob = this.onChangeDob.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeTou = this.onChangeTou.bind(this);

    this.checkEmail = this.checkEmail.bind(this);
    this.checkUsername = this.checkUsername.bind(this);
    this.checkPassword = this.checkPassword.bind(this);


    // just copied from browser to apply to google autocompete component
    this.inputStyle = {
      'WebkitAppearance': 'textfield',
      'WebkitTapHighlightColor': 'rgba(0, 0, 0, 0)',
      'width': '100%',
      'border': 'none',
      'outline': 'none',
      'backgroundColor': 'rgba(0, 0, 0, 0)',
      'color': 'rgba(0, 0, 0, 0.870588)',
      'position': 'relative',
      'padding': '0px',
      'height': '100%',
      'fontSize' : '16px',
      'boxSizing': 'border-box',
      'marginTop': '14px',
      'cursor': 'inherit',
      'borderBottom' : '1px solid #ddd',
      'paddingBottom' : '4px',
    }
  }

  render() {
    return (
      <div className="RegisterForm hasBg">
        <Page>

          <div className="hasBg">
            <div className="Question p-a card z-depth-1">

              <div className="card-text p-a">
                <FacebookLogin
                  forceRedirect={true}
                  appId={this.props.route.Represent.facebookAppId}
                  fields="name,email,picture"
                  callback={this.facebookCallback}
                  cssClass="facebook"
                  textButton="Connect with Facebook" />
                {/*<button className="google">Google</button>*/}
                <button style={{marginLeft: '5px', fontWeight:'200', float: 'right'}}  onClick={() => browserHistory.push(window.location.pathname.replace('register', 'signin'))}>I already have an account</button>

              </div>

              <div className="card-action">


                <TextField
                  value={this.state.formValues.email}
                  floatingLabelText="Your email"
                  onChange={this.onChangeEmail}
                  onBlur={this.checkEmail}
                  errorText={this.state.formErrors.email}
                  className="textInput"
                /> 


                <Autocomplete
                  style={this.inputStyle}
                  onPlaceSelected={this.onChangeLocation}
                  types={['(regions)']}
                />

                <TextField
                  value={this.state.formValues.username}
                  floatingLabelText="Username"
                  onChange={this.onChangeUsername}
                  onBlur={this.checkUsername}
                  errorText={this.state.formErrors.username}
                  className="textInput"
                /> 
                <TextField
                  value={this.state.formValues.password}
                  floatingLabelText="Set a password"
                  onChange={this.onChangePassword}
                  onBlur={this.checkPassword}
                  errorText={this.state.formErrors.password}
                  type="password"
                  className="textInput"
                /> 
                <DatePicker
                  value={this.state.formValues.dob}
                  onChange={this.onChangeDob}
                  maxDate={this.state.maxDate}
                  hintText="What's your date of birth?"
                  locale="en_GB"
                />

                <SelectField
                  value={this.state.formValues.gender}
                  maxHeight={200}
                  onChange={this.onChangeGender}>
                  <MenuItem value={false} primaryText="Gender" disabled={true} />
                  <MenuItem value={1} primaryText="Man" />
                  <MenuItem value={2} primaryText="Woman" />
                  <MenuItem value={3} primaryText="Other" />
                  <MenuItem value={0} primaryText="Rather not say" />
                </SelectField>
                

 
                <Checkbox
                  value={this.state.formValues.tou}
                  className="Checkboxed"
                  onCheck={this.onChangeTou}
                  label={(<span>I have read and agree to the <a href="http://help.represent.me/policies/terms-of-use/">terms and conditions</a> and <a href="http://help.represent.me/policies/privacy-policy/">privacy policy</a></span>)}
                />
                 


    
    <RaisedButton label="Join" primary={true}  onClick={this.register} style={{marginRight: '15px', backgroundColor: '#1B8AAE'}} />
    <RaisedButton label="Cancel"  onClick={this.navigateNext} />
 
              </div>

              {this.state.error && (
                <div style={{color: 'red'}}>{this.state.error}</div>
              )}

            </div>
          </div>
          <p className="small">Represent is people-first democracy platform which lets you have your say, find and choose the best representatives, take action, and evolve democracy</p>

        </Page>
      </div>
    )
  }


  checkEmail(e) {
    let email = e.target.value;
    let isEmailValid = EmailValidator.validate(email);
    if(!isEmailValid) {
      this.setError({
        email: 'This is not a valid email'
      });
    } else {
      this.props.route.Represent.API.GETRequest('/auth/check_email/', {email: email}, function (check_result) {
        let isInUse = check_result.result === true;
        this.setError({
          email: isInUse ? 'This email is already in use' : null
        });
      }.bind(this))
    }
  }

  checkUsername(e) {
    let username = e.target.value;
    if(username.indexOf(' ') != -1) {
      this.setError({
        username: 'Username can not contain spaces'
      });
    } else {
      this.props.route.Represent.API.GETRequest('/api/users/', {username__iexact: username}, function (check_result) {
        let isInUse = check_result.results.length > 0;
        this.setError({
          username: isInUse ? 'This username is already in use' : null
        });
      }.bind(this))
    }
  }
  checkPassword(e) {
    let pass = e.target.value;
    this.setError({
      password: pass.length >= 8 ? null : 'Password should be at least 8 character long'
    })
  }

  onChangeEmail(e) {
    let email = e.target.value;
    let valueObj = {
      email: email
    };
    let atIndex = email.indexOf('@');
    valueObj['username'] = email.substr(0, atIndex == -1 ? email.length : atIndex);

    this.setValue(valueObj)
  }
  onChangeUsername(e) {
    this.setValue({
      username: e.target.value.replace(' ', '_')
    })
  }
  onChangePassword(e) {
    this.setValue({
      password: e.target.value
    });
    if(this.state.formErrors.password) {
      this.checkPassword(e);
    }
  }
  onChangeDob(e, date) {
    this.setValue({
      dob: date
    })
  }
  onChangeGender(e, i, value) {
    this.setValue({
      gender: value
    })
  }
  onChangeLocation(place) {
    this.setValue({
      location: place
    })
  }
  onChangeTou(e, checked) {
    this.setValue({
      tou: checked
    })
  }

  setValue(errorObj) {
    this.setState(function (prevState) {
      return {
        formValues: Object.assign({}, prevState.formValues, errorObj)
      }
    });
  }

  setError(errorObj) {
    this.setState(function (prevState) {
      return {
        formErrors: Object.assign({}, prevState.formErrors, errorObj)
      }
    });
  }

  getErrorMessage(errorObj) {
    let errorMessage = null;
    if(errorObj['username']) {
      errorMessage = 'Too long! 30 characters maximum!';
    } else {
      errorMessage = JSON.stringify(errorObj);
    }
    return errorMessage;
  }

  facebookCallback(data) {
    this.props.route.Represent.API.POSTRequest('/auth-yeti/', {provider: 'facebook', access_token: data.accessToken} , function(result) {
      this.props.route.Represent.API.authenticateLocalStorage(result.auth_token, function() {
        this.navigateNext();
      }.bind(this));
    }.bind(this));
  }

  registerErrorObjToStr(error, errorObj) {
    let errorMessage = null;
    if(errorObj) {
      if(errorObj['username']) {
        errorMessage = 'Too long! 30 characters maximum!';
      }
    } else {
      errorMessage = error
    }

    return errorMessage;
  }

  register() {
    let validationError = null;

    if(!this.state.formValues.password || this.state.formValues.password.length < 8) {
      validationError = 'Password is less than 8 characters';
    }
    if(!EmailValidator.validate(this.state.formValues.email)) {
      validationError = 'Please enter a valid email address';
    }
    if(!this.state.formValues.username) {
      validationError = 'Please type in username';
    }
    if(this.state.formValues.gender === false) {
      validationError = 'Please select your gender';
    }
    if(!this.state.formValues.dob) {
      validationError = 'Please select your date of birth';
    }
    if(!this.state.formValues.tou) {
      validationError = 'You must agree to the terms and conditions';
    }

    // Check if account already exists

    if(validationError) {
      this.setState({error: validationError});
    } else {
      this.setState({error: null});

      let reqObj = {
        email: this.state.formValues.email,
        username: this.state.formValues.username,
        password: this.state.formValues.password,
        gender: this.state.formValues.gender,
        dob: this.state.formValues.dob.getFullYear() + "-" + (this.state.formValues.dob.getMonth() + 1) + "-" + this.state.formValues.dob.getDate(),
      };
      let locLat = this.state.formValues.location['geometry']['location'].lat();
      let locLon = this.state.formValues.location['geometry']['location'].lng();
      if (!!locLat) {
        reqObj['location'] = {
          "type": "Point",
          "coordinates": [locLon, locLat]
        };
      }
      reqObj['address'] = this.state.formValues.location.formatted_address;


      // Register
      this.props.route.Represent.API.POSTRequest('/auth/register/', reqObj, function(register_result) {

        console.log('Signed up successfully');
        this.props.route.Represent.API.authenticateLocalStorage(register_result.auth_token, function() {
          this.navigateNext();
        }.bind(this));

      }.bind(this), function(register_result) {

        this.setState({
          errorObj: this.getErrorMessage(register_result.responseJSON)
        });

      }.bind(this));


    }
  }

  navigateNext() {
    if(this.props.params.redirect) {
      browserHistory.push(decodeURIComponent(this.props.params.redirect));
    }else {
      browserHistory.push('/');
    }
  }

}

export default Register;
