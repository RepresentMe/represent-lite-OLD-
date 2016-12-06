import React, {Component} from 'react';
import $ from 'jquery';

class Page extends Component {
  render() {

    let outerStyle = this.props.style;
    $.extend(outerStyle, {height: '100%', width: '100%'});

    return (
      <div style={this.props.style}>
        <div style={{display: 'table', height: '100vh', width: '100%'}}>
          <div style={{display: 'table-cell', verticalAlign: 'middle', padding: '0px', boxSizing: 'border-box', height: '100%', width: '100%'}}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
