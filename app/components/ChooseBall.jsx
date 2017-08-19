import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router } from 'react-router-dom'
import Firebase from 'firebase';

const balls = [
  { name: 'Heavy Duty', description: 'Ball fashioned by the vikings themselves. This is the ball of choice for those serious about strength.', img: './assets/textures/grayball-choose.png' },
  { name: 'Sleuth', description: "You're efficient. You like things that move with the grace of a cheetah. Choose this ball if this describes you.", img: './assets/textures/netball-choose.png' },  
]

class ChooseBall extends React.Component {
  constructor(props) {
    super(props)
    this.ballChoice = this.ballChoice.bind(this)
  }

  componentDidMount() {
    const anonymousUser = {
      userId: this.props.loginObj.uid,
      username: this.props.loginObj.uid,
      wins: 0,
      totalScore: 0,
      losses: 0,
      ball: 0,
      gameId: this.props.user.gameId,
    }
    const user = this.props.loginObj.email ? this.props.loginObj : anonymousUser
    this.props.setUser(user)      
  }

  ballChoice(evt) {
    this.props.chooseBall(+evt.target.id)
  }

  sendDataToFB() {
    const user = this.props.user;
    const ref = firebase.database().ref("users/"+user.userId)
    ref.set(user)
    this.props.setUser(user)    
  }

  render() {
    const playerName = this.props.user.username && this.props.user.username ? this.props.user.username : 'Anonymous'
    const chosenBall = balls[this.props.user.ball]
    const ballMessage = chosenBall ? `You have chosen ${chosenBall.name}` : 'You have not yet chosen a ball'
    const nextURL = this.props.user.gameId < 100 ? `${this.props.user.gameId}/play` : `${this.props.user.gameId}/wait`;

    return (
      <div className="container is-fluid">
        <div className="content has-text-centered">
          <div className="notification">
            <h3>Choose Your Ball</h3>
            <h5><strong>{ballMessage}</strong></h5>
            <div className="horiz-marg">
              <div className="columns is-multiline">
                {balls && balls.map((ball, i) => (
                  <article key={i}
                    className="column is-one-third product-grid-item">
                    <div key={ball.id} className="inner-product">
                      <br />
                      <figure className="image">
                        <img src={ball.img} id={i} alt="Image" onClick={(evt) => this.ballChoice(evt)}/>
                      </figure>
                      <p className="subtitle">{ball.name}</p>
                      <p className="subtitle">{ball.description}</p>
                      <button id={i} onClick={(evt) => this.ballChoice(evt)}
                        className="button is-success is-outlined playnow">
                        Choose Ball
                      </button>
                    </div>
                  </article>
                )
                )}
              </div>
            </div>
          </div>
          <br></br>
          <div className="notification">
          <Link to={`/game`} onClick={(evt) => this.sendDataToFB(evt)}><button className="button is-success">Continue</button></Link>
          </div>
        </div>
      </div>
    );
  }
}

// /* -----------------    CONTAINER     ------------------ */

import { setUser, chooseBall } from '../reducers/auth'
import { connect } from 'react-redux'
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user
})

const mapDispatch = ({ setUser, chooseBall })

export default connect(mapStateToProps, mapDispatch)(ChooseBall)
