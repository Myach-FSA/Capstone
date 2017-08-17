import React, {Component} from 'react'
import createScene1 from './Scene1'
import createScene2 from './Scene2'
import InfoScreen from './InfoScreen'
import ScoreTable from './ScoreTable'

/* global BABYLON */
let sceneNum = 1
const changeScene = () => {
  sceneNum++
}
class Game extends Component {
  componentDidMount() {
    window.onkeydown = function(e) {
      e.preventDefault();
      if (e.keyCode === 9){
        document.getElementById('ScoreTable').className = "scoreTable visible has-text-centered"
        document.getElementById('InfoScreen').className = "infoScreen invisible has-text-centered"
      }
    }

    window.onkeyup = function(e) {
      e.preventDefault();
      if (e.keyCode === 9){
        document.getElementById('ScoreTable').className = "scoreTable invisible has-text-centered"
        document.getElementById('InfoScreen').className = "infoScreen visible has-text-centered"
      }
    }

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
            scene = createScene3(canvas, engine)
            break
          default:
            scene = createScene1(canvas, engine)
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
      <div>
        <InfoScreen/>
        <ScoreTable/>
        <canvas className='gameDisplay ' ref="renderCanvas"></canvas>
      </div>
    )
  }
}

export default Game

export {changeScene}
