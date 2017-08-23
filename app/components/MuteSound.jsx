import React from 'react';
import ReactDOM, {render} from 'react-dom';

class MuteSound extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this
      .clickHandler
      .bind(this);
    this.class = 'fa fa-volume-up fa-4x';
    this.isPlaying = true;
  }

  clickHandler(evt) {
    const mute = $('#' + evt.target.id);
    const buttonClass = mute.attr('class');
    mute.toggleClass(buttonClass);
    mute.toggleClass(this.class);
    this.class = buttonClass;
    if (this.isPlaying) {
      audio0.pause();
      this.isPlaying = false;
    } else {
      audio0.play();
      this.isPlaying = true;
    }
  }

  render() {
    return (<i
      id="muteSound"
      onClick={(evt) => this.clickHandler(evt)}
      className="fa fa-volume-off fa-4x"
      aria-hidden="true"/>);
  }
};

export default MuteSound;
