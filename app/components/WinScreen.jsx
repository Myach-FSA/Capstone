import React from 'react';
import ReactDOM, { render } from 'react-dom';

class WinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.winImgVisible = false;
    this.component = null;
  }
  render() {
    this.props.database.ref('event').on('value', (eventMessage) => {
      const eventType = eventMessage.val().split(',')[0];
      const gameId = eventMessage.val().split(',')[1];
      const userId = eventMessage.val().split(',')[2];
      if (eventType === 'win' && gameId === this.props.user.gameId && userId === this.props.user.userId) {
        this.component = <img className="winScreen" src="/assets/winScreen.png"/>;
      } else if (eventType === 'win' && gameId === this.props.user.gameId && userId !== this.props.user.userId) {
        this.component = <img className="winScreen" src="/assets/defeatScreen.png"/>;
      }
    });
    const gameId = this.props.user.gameId;
    const user = this.props.user.userId;
    if (this.props.user.totalScore > 1) {
      const eventMessage = 'win,' + gameId + ',' + user;
      this.props.database.ref('event').set(eventMessage);
    }
    return (<img className="winScreen invisible" src="/assets/winScreen.png" />);
  }
};

export default WinScreen;
