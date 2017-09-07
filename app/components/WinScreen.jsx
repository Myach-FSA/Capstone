import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactDOM, { render } from 'react-dom';

class WinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasWinner: null
    };
  }

  componentWillMount() {
    const gameId = this.props.user.gameId;
    const user = this.props.user.userId;
    this.props.database.ref('games/' + gameId + '/gameInfo').on('value', victor => {
      if (victor.val().winner === user) {
        this.setState({hasWinner: <img className="winScreen" src="/assets/winScreen.png" />});
      } else if (victor.val().winner !== user && victor.val().winner) {
        this.setState({ hasWinner: <img className="winScreen" src="/assets/defeatScreen.png" /> });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const gameId = this.props.user.gameId;
    const user = this.props.user.userId;
    if (this.props.user.totalScore >= 2 && this.props.user.totalScore !== prevProps.user.totalScore) {
      this.props.database.ref('games/' + gameId + '/gameInfo').update({ winner: user });
      this.props.database.ref('users/' + user).update({ totalScore: 0 });
    }
  }

  componentWillUnmount() {
    const gameId = this.props.user.gameId;
    this.props.database.ref('games/' + gameId + '/gameInfo').off();
  }

  endGame = () => {
    if (this.state.hasWinner) {
      setTimeout(() => {
        this.props.history.push('/');
      }, 5000);
    }
    return this.state.hasWinner;
  }

  render() {
    return (
      <div>
        {this.endGame()};
      </div>
    );
  }
};

export default withRouter(WinScreen);
