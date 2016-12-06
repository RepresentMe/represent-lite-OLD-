
const initialState = {
  curUserProfile: null
};

const userReducer = function(state = initialState, action) {

  switch(action.type) {
    case 'userLoggedIn':
      return Object.assign({}, state, { curUserProfile: action.userProfile });
    case 'userLoggedOut':
      return Object.assign({}, state, { curUserProfile: null });
    case 'updateCurUserProfile':
      return Object.assign({}, state, { curUserProfile: action.userProfile });
  }

  return state;
};

export default userReducer;
