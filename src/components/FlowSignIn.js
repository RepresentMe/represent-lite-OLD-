import React, {Component} from 'react';
import Page from './Page';
import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';


class FlowSignIn extends Component {

  constructor() {
    super();
  }

  render() {
    return (
    	<div className="hasBg">
      <Page style={{height: '100vh', color: '#000000', backgroundColor: '#ffffff', position: 'relative'}} >
        <div className="Question p-a card z-depth-1">

        <div className="card-text p-a">
        <h1>{"To make a difference, we need to know who's voting"}</h1>
        <h2><Link to={"/register" + (this.props.redirect ? '/' + encodeURIComponent(this.props.redirect) : '' )}>&raquo; Create an account</Link></h2>

        <h2><Link to={"/signin" + (this.props.redirect ? '/' + encodeURIComponent(this.props.redirect) : '' )}>&raquo; Sign In</Link></h2>
 
        </div>
        </div>
          <p className="small">Represent is people-first democracy platform which lets you have your say, find and choose the best representatives, take action, and evolve democracy</p>
      </Page>
      </div>
    )
  }

}

export default FlowSignIn;
