import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router } from 'react-router-dom';
import firebase from 'firebase';

const balls = [
  { name: 'Heavy Duty', description: 'Ball fashioned by the vikings themselves.', img: '/assets/textures/grayball-choose.png' },
  { name: 'Sleuth', description: "You like things that move with the grace of a cheetah.", img: '/assets/textures/netball-choose.png' },
  { name: 'Alvin', description: "Always win with Alvin.", img: '/assets/textures/students/alvin.png' },
  { name: 'Andrew', description: "Andrew and his dog.", img: '/assets/textures/students/andrew.png' },
  { name: 'Denis', description: "Pick Denis.", img: '/assets/textures/students/denys.png' },
  { name: 'Evan', description: "You can never go wrong with this ball.", img: '/assets/textures/students/evan.png' },
  { name: 'Snow', description: "No one wears fur like Snow.", img: '/assets/textures/students/snow.png' },
  { name: 'Won Jun', description: "Won Jun is ... Won Jun.", img: '/assets/textures/students/won_jun.png' },
  { name: 'Grass', description: "Maybe you like grass.", img: '/assets/textures/students/grass-large.png' },
];

class ChooseBall extends React.Component {
  constructor(props) {
    super(props);
    this.ballChoice = this.ballChoice.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const differentBallId = this.props.user.ball !== nextProps.ball;
    return differentBallId;
  }

  ballChoice(evt) {
    this.props.chooseBall(+evt.target.id);
    this.sendDataToFB();
  }

  sendDataToFB() {
    const user = this.props.user;
    const ref = firebase.database().ref('users/'+user.userId);
    ref.set(user);
  }

  render() {
    const playerName = this.props.user.username && this.props.user.username ? this.props.user.username : 'Anonymous';
    const chosenBall = balls[this.props.user.ball];
    const ballMessage = chosenBall ? `You have chosen ${chosenBall.name}` : 'You have not yet chosen a ball';

    return (
        <div className="content has-text-centered notification">
          <h1><strong>Choose Your Ball</strong></h1>
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
                        className="button is-success is-outlined">
                        Choose Ball
                      </button>
                    </div>
                  </article>
                )
                )}
              </div>
            </div>
          </div>
    );
  }
}

// /* -----------------    CONTAINER     ------------------ */

import { chooseBall } from '../reducers/auth';
import { connect } from 'react-redux';
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user
});

const mapDispatch = ({ chooseBall });

export default connect(mapStateToProps, mapDispatch)(ChooseBall);
