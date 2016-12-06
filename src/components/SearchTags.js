import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';

class SearchTags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      suggestedTags: []
    };

    this.dataSourceConfig = {
      text: 'text',
      value: 'id'
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.valueSelected = this.valueSelected.bind(this);
  }

  render() {
    return (
      <div style={{boxShadow: 0}}><AutoComplete      
        hintText="Type anything"
        searchText={this.state.searchText}
        dataSource={this.state.suggestedTags}
        dataSourceConfig={this.dataSourceConfig}
        onUpdateInput={this.handleSearchChange}
        onNewRequest={this.valueSelected}
        floatingLabelText="Add topic tags"
        fullWidth={false}
      /></div>
    )
  }

  handleSearchChange(value) {
    let reqObj = {
      page: 1,
      page_size: 8,
      search: value,
      ordering: '-questions_count'
    };
    this.props.API.GETRequest('/api/tags/', reqObj, function(res) {
      this.setState({
        suggestedTags: res.results,
        searchText: value
      })
    }.bind(this))
  }

  valueSelected(value) {
    this.props.onTagAdded(value);
    setTimeout(()=>{
      this.setState({
        searchText: ''
      })
    }, 200);
  }
}

export default SearchTags;