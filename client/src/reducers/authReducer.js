const initialState = {
    isAuthenticated: false,
    user: {}
}

export default function(state = initialState, action) {
    switch (action.type) {
    //   case GET_ERRORS:
    //     return {
    //       ...state,
    //       user: action.payload
    //     };
      default:
        return state;
    }
  }