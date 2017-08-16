import React, { Component } from 'react'
import createScene1 from './Scene1'
import createScene2 from './Scene2'

/* global BABYLON */
let sceneNum = 1
const changeScene = () => {
  sceneNum++
}
class Game extends Component {
  componentDidMount() {
    const canvas = this.refs.renderCanvas
    const engine = new BABYLON.Engine(canvas, true)
    let num = sceneNum
    let scene = null
    engine.runRenderLoop(() => {
      if (!scene || (sceneNum !== num)) {
        num = sceneNum
        switch (num) {
          case 2:
            scene = createScene2(canvas, engine)
            break
          case 3:
            scene = createScene3()
            break
          default: scene = createScene1(canvas, engine)
        }
        setTimeout(scene.render(), 500)
      } else {
        scene.render()
      }
    })

    window.addEventListener('resize', () => {
      engine.resize()
    })
  }
  
  render() {
    return (
      <canvas className='gameDisplay ' ref="renderCanvas"></canvas>
    )
  }
}

export default Game

export { changeScene }
