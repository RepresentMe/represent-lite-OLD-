import React, {Component} from 'react';

class Iframe extends Component {
  render() {
    return (
      <iframe src="http://localhost:3000/group/20/represent?showComments=true" style={{width:'100%', height:'100%'}} />
    )
  }
}

export default Iframe;