import * as ActionTypes from './ActionTypes';

export const Feedbacks = (state  = {errMess: null,feedbacks:[]}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_FEEDBACK:
        return {...state,  errMess: null, leaders: action.payload};

        default:
          return state;
      }
};