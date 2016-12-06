import { TwitterPicker } from 'react-color'
import React, {Component} from 'react';
import t from 'tcomb-form';

// statefull picker
class ColorPicker extends Component {

  state = {
    isOpen: false
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  onChange = (color) => {
    this.setState({ isOpen: false })
    this.props.onChange(color.hex)
  }

  render() {
    const color = this.props.value || undefined // react-color doesn't like null
    return (
      <div className="input-group-addon">
        {/* trigger: opens / closes the color picker */}
        <TwitterPicker
          color={color}
          onChangeComplete={this.onChange}
          width='100%'
          height='33px'
          colors={['#000000', '#ffffff', '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']}
        />
      </div>
    )
  }

}

function renderTextbox(locals) {
  const onChange = (evt) => locals.onChange(evt.target.value)
  return (
    <div>
      <div className="input-group">
        <input className="form-control" type="text" value={locals.value} onChange={onChange}/>
        <ColorPicker value={locals.value} onChange={locals.onChange} />
      </div>
    </div>
  )
}

// here we are: the factory
class ColorPickerFactory extends t.form.Textbox {

  getTemplate() {
    return t.form.Form.templates.textbox.clone({ renderTextbox });
  }

}

export default ColorPickerFactory;
