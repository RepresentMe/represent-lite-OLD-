import GooglePlacesSuggest from 'react-google-places-suggest'
import React, {Component} from 'react';
import t from 'tcomb-form';

class GeoLocationFactory extends t.form.Textbox {

  getTemplate() {
    return t.form.Form.templates.textbox.clone({ renderTextbox });
  }

}

export default GeoLocationFactory;
