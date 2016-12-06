import React, {Component} from 'react';
import {Page} from './components';
import t from 'tcomb-form';
import ColorPickerFactory from './misc/color-picker-factory.js';

let Form = t.form.Form;

let options = {
  fields: {
    baseColor: {
      factory: ColorPickerFactory
    },
    textColor: {
      factory: ColorPickerFactory
    },
    embedCode: {
      type: 'textarea'
    }
  }
}

let EmbedType = t.struct({
  theUrl: t.String,
  type: t.enums({
    group: 'Group',
    collection: 'Collection',
    single: 'Single Question'
  }),
  objectNumber: t.String,
  flow: t.enums({
    questionsThenResults: 'Questions followed by results',
    questionsOnly: 'Questions with no results',
    resultsOnly: "Don't display questions, just show the results"
  }),
  baseColor: t.String,
  textColor: t.String,
  embedCode: t.String
});

class EmbedGenerator extends Component {

  constructor() {
    super();
    this.state = {
      formValue: {}
    }
    this.onFormChange = this.onFormChange.bind(this);
  }

  render() {

    let baseColor = this.state.formValue.baseColor || '#ffffff';
    let textColor = this.state.formValue.textColor || '#000000';

    document.body.style.backgroundColor = baseColor;
    document.body.style.color = textColor;

    return (
      <Page>
        <h1>Generate your embed code</h1>
        <Form
          ref="form"
          options={options}
          type={EmbedType}
          value={this.state.formValue}
          onChange={this.onFormChange}
        />
      </Page>
    );
  }

  onFormChange(result) {

    let urlParts = null;
    let formResult = result;

    if(result.theUrl) {
      urlParts = result.theUrl.split("represent.me/");
      if(urlParts[1]) {
        urlParts = urlParts[1].split("/");
        if(urlParts[0] === 'group') {
          formResult.type = 'group';
          formResult.objectNumber = urlParts[1];
        }else if(urlParts[0] === 'collections') {
          formResult.type = 'collection';
          formResult.objectNumber = urlParts[1];
        } else if(!isNaN(urlParts[0])) {
          formResult.type = 'single';
          formResult.objectNumber = urlParts[0];
        }
      }

    }

    let embedUrl = '';

    if(formResult.type === 'group') {
      embedUrl = '/group/' + ( formResult.objectNumber || '' );
    }else if(formResult.type === 'collection') {
      embedUrl = '/collections/' + ( formResult.objectNumber || '' );
    }else {
      embedUrl = '/' + ( formResult.objectNumber || '' );
    }

    let baseColor = formResult.baseColor || '#ffffff';
    let textColor = formResult.textColor || '#000000';

    formResult.embedCode = '<iframe src="http://share.represent.me' + embedUrl + '/?baseColor=' + baseColor.replace('#', '') + '&textColor=' + textColor.replace('#', '') + '"></iframe>';

    this.setState({
      formValue: formResult
    });
  }


}

export default EmbedGenerator;
