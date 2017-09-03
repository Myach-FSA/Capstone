import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link, NavLink, Router } from 'react-router-dom';
import firebase from 'firebase';
import ballImages from './balls';

class ChooseBall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
    this.ballChoice = this.ballChoice.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const differentBallId = this.props.user.ball !== nextProps.ball;
    return differentBallId;
  }

  ballChoice(evt) {
    this.setState({ clicked: true });
    this.props.chooseBall(+evt.target.id);
    this.sendDataToFB(+evt.target.id);
  }

  sendDataToFB(id) {
    const user = this.props.user;
    const ref = firebase.database().ref('users/'+user.userId);
    user.ball = id;
    ref.child('wins').once('value').then(snapshot => {
      if (snapshot.exists())ref.update({gameId: user.gameId, ball: id});
      else ref.set(user);
    });
  }

  render() {
    const playerName = this.props.user.username && this.props.user.username ? this.props.user.username : 'Anonymous';
    const chosenBall = ballImages[this.props.user.ball - 1];
    const ballMessage = this.state.clicked ? `You have chosen ${chosenBall.name}` : 'You have not yet chosen a ball';

    return (
      <div className="content has-text-centered notification">
        <h1><strong>Choose Your Ball</strong></h1>
        <h5><strong>{ballMessage}</strong></h5>
        <div className="horiz-marg">
          <div className="columns is-multiline">
            {ballImages && ballImages.map((ball, i) => (
              <article key={i}
                className="column is-one-quarter product-grid-item">
                <div key={i+1} className="inner-product">
                  <br />
                  <figure>
                    <img src={ball.img} className='imgBall' alt="Image" onClick={(evt) => this.ballChoice(evt)} />
                  </figure>
                  <p className="subtitle">{ball.name}</p>
                  <p className="subtitle">{ball.description}</p>
                  <button id={i+1} onClick={(evt) => this.ballChoice(evt)}
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
