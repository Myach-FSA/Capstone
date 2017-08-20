const initialState = { render: false };

const SHOW_GAME_LIST = 'SHOW_GAME_LIST';
export const showGameList = (render) => ({ type: SHOW_GAME_LIST, render });

export default function gameListReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_GAME_LIST:
      return Object.assign({}, state, {render: action.render});
    default:
      return state;
  }
}

