import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactDOM, {render} from 'react-dom';

class WinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null
    };
    this.loop;
    this.endGame = this
      .endGame
      .bind(this);
  }

  endGame() {
    setTimeout(() => {
      this.props.history.push('/');
    }, 5000);
  }

  render() {
    this
      .props
      .database
      .ref('event')
      .on('value', (eventMessage) => {
        const eventType = eventMessage
          .val()
          .split(',')[0];
        const gameId = eventMessage
          .val()
          .split(',')[1];
        const userId = eventMessage
          .val()
          .split(',')[2];
        if (eventType === 'win' && gameId === this.props.user.gameId && userId === this.props.user.userId && !this.state.component) {
          this.setState({component: <img className="winScreen" src="/assets/winScreen.png"/>});
          this.endGame();
        } else if (eventType === 'win' && gameId === this.props.user.gameId && userId !== this.props.user.userId && !this.state.component) {
          this.setState({component: <img className="winScreen" src="/assets/defeatScreen.png"/>});
          this.endGame();
        }
      });
    const gameId = this.props.user.gameId;
    const user = this.props.user.userId;
    if (this.props.user.totalScore >= 10) {
      const eventMessage = 'win,' + gameId + ',' + user;
      this.props.database.ref('event').set(eventMessage);
      this.props.database.ref('users/' + user).update({totalScore: 0});
    }
    return this.state.component;
  }
};

export default withRouter(WinScreen);
