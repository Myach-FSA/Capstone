import React from 'react';
import { NavLink } from 'react-router-dom';

const FooterSection = () => {
    return (
      <footer id="footersec">
        <div className="container">
          <div className="has-text-centered">
            <h4>
              <strong className="title">Myach</strong>
            </h4>
            <p><a href="http://jgthms.com">By Dan, Denis, Yu, and Nancy</a></p>
            <p>
              <a className="icon" href="https://github.com/jgthms/bulma">
                <i className="fa fa-github"></i>
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
};

export default FooterSection;
