const initialState = {
  percentageCompleted: null,
  questionsCountInFlow: null,
  answeredCountInFlow: null,
  flowType: null,
  name: null,
  id: null,
  imageUrl: null,
  slug: null,
};

const currentFlowReducer = function(state = initialState, action) {

  switch(action.type) {
    case 'setPercentageCompletedInCurrentFlow':
      return Object.assign({}, state, {
        percentageCompleted: action.percentageCompleted,
        questionsCount: action.questionsCount,
        answeredCount: action.answeredCount,
      });
    case 'setCurrentFlowData':
      return Object.assign({}, state, {
        flowType: action.flowType, // group, collection etc
        name: action.name, // name of group, collection etc
        id: action.id, // id of group, collection etc
        imageUrl: action.imageUrl, // image of group, collection etc
        slug: action.slug // image of group, collection etc
      });

  }

  return state;

};

export default currentFlowReducer;
