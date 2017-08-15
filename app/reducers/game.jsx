const initialState={
  sceneNum: 0,
  ball: ''
}
const CREATE_SCENE = 'CREATE_SCENE'
const GET_SCENE = 'GET_SCENE'

export const createScene = sceneNum => ({type: CREATE_SCENE, sceneNum})
export const getScene = () => ({type: GET_SCENE})

export default function gameReducer(state=initialState, action) {
  const newState = Object.assign({}, state)
  switch (action.type) {
  case CREATE_SCENE:
    console.log(action.sceneNum)
    newState.sceneNum=action.sceneNum
    break
  default: return state
  }
  return newState
  // case CREATE_SCENE:
  //   switch (action.scene[0]) {
  //   case 1:
  //     newState.scene = createScene1(action.scene[1], action.scene[2])
  //     break
  //   case 2:
  //     newState.scene = createScene2(action.scene[1], action.scene[2])
  //     break
  //   default: newState.scene = createScene1(action.scene[1], action.scene[2])
  //   }
  //   break
  // case GET_SCENE:
  //   console.log('in get', newState.scene)
  //   break
  // default:
  //   console.log('I should not hit this')
  //   return state
  // console.log('newState', newState)
  //return newState
}
