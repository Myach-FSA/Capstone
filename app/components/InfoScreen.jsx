import React from 'react';
import ReactDOM, { render } from 'react-dom';

class InfoScreen extends React.Component {
  render() {
    const { name, score } = this.props

    return (
      <div id="InfoScreen" className="infoScreen has-text-centered">
        Hello
      </div>
    );
  }
}

// /* -----------------    CONTAINER     ------------------ */

import { connect } from 'react-redux'
import store from '../store'

const mapStateToProps = (state) => { return { user: state.auth.user } }

export default connect(mapStateToProps)(InfoScreen)
