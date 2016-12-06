import $ from 'jquery';
import store from './store';

class RepresentAPI {

  constructor() {

    this.auth_token = null;
    this.apiurl = null;

    // Detirmine which URL to use

    if (location.host === 'represent.me' || location.host === 'share.represent.me') {
      this.apiurl = 'https://api.represent.me';
    } else if (location.host === 'test.represent.me') { // test
      this.apiurl = 'https://test.represent.me';
    } else { // local
      this.apiurl = 'http://localhost:8000';
    }

    // Detirmine auth token override

    let auth_override = this.findGetParameter('auth_override');

    if(auth_override) {
      this.authenticateLocalStorage(auth_override);
    }

    // Detirmine whether user is logged in or not

    if(this.auth_token === null) {

      let local_token = localStorage.getItem('auth_token');

      if(local_token === null) {
        this.auth_token = null;
      }else {
        this.auth_token = local_token;
      }
    }

    if(this.auth_token) {
      console.log('Using auth token ' + this.auth_token);
    }else {
      console.log('Not using auth token');
    }

  }

  authenticated() {
    if(this.auth_token) {
      return true;
    }else {
      return false;
    }
  }

  GETRequest(url, data, success, failure) {

    $.ajax({
      dataType: "json",
      method: "GET",
      url: this.apiurl + url,
      beforeSend: function(xhr){
        if(this.auth_token) {
          xhr.setRequestHeader('Authorization', "Token " + this.auth_token);
        }
      }.bind(this),
      data: data,
      success: function(output) {
        success(output);
      },
      error: function(output) {
        if(failure) {
          failure(output);
        }else {
          console.log('GET ' + url + ' failed');
        }
      }
    });

  }

  POSTRequest(request, data, success, failure) {

    $.ajax({
      dataType: "json",
      method: "POST",
      contentType: "application/json",
      url: this.apiurl + request,
      beforeSend: function(xhr){
        if(this.auth_token) {
          xhr.setRequestHeader('Authorization', "Token " + this.auth_token);
        }
      }.bind(this),
      data: JSON.stringify(data),
      success: function(output) {
        success(output);
      },
      error: function(output) {
        if(failure) {
          failure(output);
        }else {
          console.log('POST ' + request + ' failed');
        }
      }
    });

  }

  authenticateLocalStorage(auth_token, callback) {
    this.auth_token = auth_token;
    this.GETRequest('/auth/me/', null, function(user) {
      store.dispatch({
        type: 'userLoggedIn',
        userProfile: user
      });
      window.analytics.identify(user.username, user);
      localStorage.setItem('auth_token', this.auth_token);
      localStorage.setItem('user', JSON.stringify(user));
      if(callback) {
        callback();
      }
    }.bind(this));
  }

  // for some reason JQuery thinks that this request fails, but it has success status, so error function is used here for processing response
  // probably it is because /auth/logout/ returns nothing
  logout(callback) {
    this.POSTRequest('/auth/logout/', null, function(){}, function(res) {
      store.dispatch({
        type: 'userLoggedOut'
      });
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      if(callback) {
        callback();
      }
    }.bind(this));
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

}

export default RepresentAPI;
