import React from 'react';
import ReactDOM, {render} from 'react-dom';

class WinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.winImgVisible = false;
  }

  render() {
    if (this.props.user.totalScore > 1 && !this.winImgVisible) {
      $('.winScreen').toggleClass('invisible');
      this.winImgVisible = true;
    }
    return (<img className="winScreen invisible" src="/assets/winScreen.png"/>);
  }
};

export default WinScreen;
