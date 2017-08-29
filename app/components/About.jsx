import React from 'react';
import ReactDOM, { render } from 'react-dom';

class About extends React.Component {

  render() {
    return (
      <div className="container is-fluid">
        <div className="content has-text-centered">
          <div id="choose" className="notification">
            <h1><strong>Myach was created by</strong></h1>
                <ul><a href="https://github.com/DenisUAL">Denys Andreiev</a></ul>
                <ul><a href="https://github.com/dlaveman">Dan Laveman</a></ul>
                <ul><a href="https://github.com/nilyu">Yu Lin</a></ul>
                <ul><a href="https://github.com/nancyvelasquez">Nancy Velasquez</a></ul>
            <br></br>
            <h1><strong>Music by Ibraim Soltonbaev</strong></h1>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
