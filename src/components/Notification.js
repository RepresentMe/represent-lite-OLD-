import React, { Component } from 'react';
import './styles/Notification.css';
import Page from './Page';
import Logo from './images/represent_logo_cube.png';

class Notification extends Component {

  constructor() {
    super();
    this.state = {
      closing: false
    }
    this.close = this.close.bind(this);
  }

  render() {

    return (
      <div className={"Notification " + (this.state.closing ? 'closing' : '')} style={this.props.style}>
        <Page style={{textAlign: 'center'}}>
          <div className="NotificationBody">
          {this.props.title && <div style={{position:'relative', height:'40px'}}><h1 className="title">{this.props.title}</h1>
          {/*<span style={{float: 'right'}} onClick={() => this.close()}>X</span>*/}
            <button className="closeBtn" style={{position: 'absolute', top:0, right:'1%', cursor:'pointer'}}  onClick={() => this.close()} >Close</button></div>}
          <div className={"Inset " + (this.props.full ? 'full' : '')}>
            {!this.props.full ? <img src={Logo} style={{width: '80px', margin: '10px'}} alt="Represent" /> : ''}
            {this.props.children}
            {this.props.button && <button style={{width: '100%'}} onClick={this.close}>{this.props.button}</button>}
          </div>
          </div>
        </Page>
      </div>
    );
  }

  close() {

    this.setState({
      closing: true
    });

    if(this.props.willClose) {
      this.props.willClose();
    }

    setTimeout(function(){
      if(this.props.didClose) {
        this.props.didClose();
      }
    }.bind(this), 1000);
  }

}

export default Notification;
