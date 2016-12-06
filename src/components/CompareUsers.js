import React, {Component} from 'react'
import Page from './Page';

import './styles/CompareUsers.css';

export default class CompareUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isCompareQuick: true,
      comparedUsers: null,
      noUsersToCompare: false
    }
  }

  componentWillMount() {
    // compare_check={{user.id}},5,compares__difference_percent&page_size=5&follower_users__user!={{user.id}}
    this.props.API.GETRequest('/api/users/?compare_check='+this.props.userAId+',5,compares__difference_percent&page_size=5', null, function(usersRes) {
      console.log('users', usersRes);
      let usersIds = [];

      if(usersRes.results.length == 0) {
          return this.setState({
            isLoading: false,
            noUsersToCompare: true
        })
      }

      usersRes.results.map(function(user) {
        usersIds.push(user.id);
      });

      let comparedUsers = usersRes.results;

      this.props.API.GETRequest('/api/compare_n_users_quick/?users='+usersIds.join(',')+'&usera='+this.props.userAId, null, function(compareRes) {
        console.log('compareRes', compareRes);

        let compareData = {};
        if(this.state.isCompareQuick) {
          for(var userId in compareRes.results) {
            if(!compareRes.results.hasOwnProperty(userId)) continue;
            compareData[userId] = this.processUserCompareData(compareRes.results[userId]);
          }
        } else {
          // comparedUsers[reqObj.userA.id] = getProcessedUserCompare(reqObj, res);
        }

        var filteredComparedArr = [];
        for (var i = 0; i < comparedUsers.length; i++) {
          for (var uid in compareData){
            if((comparedUsers[i].username && uid == comparedUsers[i].id) || (!comparedUsers[i].username && uid == comparedUsers[i].user)) {
              comparedUsers[i].compareData = compareData[uid];

              if(comparedUsers[i].compareData.compareUsersData.overlap < 5) break;
              filteredComparedArr.push(comparedUsers[i]);
              break;
            }
          }
        }
        comparedUsers = filteredComparedArr;

        this.setState({
          comparedUsers: comparedUsers,
          isLoading: false
        });

      }.bind(this));

    }.bind(this));
  }

  processUserCompareData(compareData) {
    let data = {};
    data.compareUsersData = compareData;
    data.compareUsersData.avg = data.compareUsersData.difference_percent;
    data.compareUsersData.disagree = 100 * data.compareUsersData.difference_distances[4] / data.compareUsersData.questions_counted;
    data.compareUsersData.agree = 100 * data.compareUsersData.difference_distances[0] / data.compareUsersData.questions_counted;
    data.compareUsersData.overlap = data.compareUsersData.questions_counted;
    return data;
  }

  render() {
    let blockContent = null;
    if(this.state.noUsersToCompare) {
      blockContent = (<div>No good match found so far. Keep going and check back soon!</div>);
    }else if(this.state.isLoading) {
      blockContent = (<div>Loading...</div>);
    } else {
      blockContent = (
        <table className="mainElem">
          <tbody>
          {/*<tr ng-show="isLoaded && compared.length == 0"><td class="text-center">No good match found so far. Keep going and check back soon!</td></tr>*/}
            {this.state.comparedUsers.map(function(user) {
              return (
                <tr key={user.id}>
                  <td>
                    <span>
                      <img className="userImage" src={user.photo} alt={user.first_name + ' ' +user.last_name} />
                    </span>
                  </td>
                  <td>
                    <a className="userName" href={'https://represent.me/profile/'+user.id+'/'+user.username} target="_blank" >
                      {user.first_name ? user.first_name : user.username}
                    </a>
                  </td>
                  <td className="text-to-right">
                    <span className="overlap">
                      {user.compareData.compareUsersData.overlap}
                    </span>
                    <span className="agreementPercentage">
                      {parseInt(100-user.compareData.compareUsersData.difference_percent)}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )
    }
    return (
      <div className="CompareUsers">
        <h1 className="title">People compared to you</h1>
        {blockContent}
      </div>
    )
  }
}