import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom'

const balls = [
  { name: 'First Ball', description: 'First ball description' },
  { name: 'Second Ball', description: 'Second ball description' },
  { name: 'Third Ball', description: 'Third ball description' },
  { name: 'Fourth Ball', description: 'Fourth ball description' },
  { name: 'Fifth Ball', description: 'Fifth ball description' }]

class ChooseBall extends React.Component {
  constructor(props) {
    super(props)
    this.ballChoice = this.ballChoice.bind(this)
  }

  ballChoice(evt) {
    console.log(evt)
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
                    <img src="http://bulma.io/images/placeholders/1280x960.png" alt="Image" />
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

import { chooseBall } from '../reducers/auth'
import { connect } from 'react-redux'
import store from '../store';

const mapStateToProps = (state) => ({
  user: state.auth.user 
})

const mapDispatch = ({ chooseBall })

export default connect(mapStateToProps, mapDispatch)(ChooseBall)