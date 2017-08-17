import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom'

const balls = [
  { name: 'Heavy Duty', description: 'Ball fashioned by the vikings themselves. This is the ball of choice for those serious about strength.', img: './assets/textures/grayball-choose.png' },
  { name: 'Sleuth', description: "You're efficient. You like things that move with the grace of a cheetah. Choose this ball if this describes you.", img: './assets/textures/netball-choose.png' },
]

class ChooseBall extends React.Component {
  constructor(props) {
    super(props)
    this.gameSetup = this.gameSetup.bind(this)
  }
  
  componentDidMount() {
    const user = this.props.loginObj
    console.log('User', user)
    this.props.setUser(user)
  }

  gameSetup () {

  }

  render() {

    const playerName = this.props.user.username ? this.props.user.username : 'Anonymous'


    return (
      <div className="content has-text-centered">
        <h1>Hi <strong>{ playerName }</strong>! Choose Your Ball</h1>
        <div className="horiz-marg">
          <div className="columns is-multiline">
            {balls && balls.map((ball, i) => (
              <article key={i}
                className="column is-one-third product-grid-item">
                <div key={ball.id} className="inner-product">
                  <br />
                  <figure className="image">
                    <img src={ball.img} alt="Image" />
                  </figure>
                  <p className="subtitle">{ball.name}</p>
                  <p className="subtitle">{ball.description}</p>
                  <button onClick={(evt) => this.ballChoice(i)}
                    className="button is-success is-outlined playnow">
                    Choose Ball
                  </button>
                </div>
              </article>
            )
            )}
          </div>
        </div>
        <br></br>
        <button type="submit" className="button is-primary is-fullwidth fullButton">
          <Link to={`/game`}>Play Now!</Link>
        </button>
      </div>
    );
  }
}

// /* -----------------    CONTAINER     ------------------ */

import { setUser } from '../reducers/auth'
import { connect } from 'react-redux'
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user 
})

const mapDispatch = ({ setUser })

export default connect(mapStateToProps, mapDispatch)(ChooseBall)