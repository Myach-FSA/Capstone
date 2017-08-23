import React from 'react';
import { NavLink } from 'react-router-dom';

const FooterSection = () => {
  return (
    <footer id="footersec">
      <div className="container">
        <div className="has-text-centered">
          <p>By Dan, Denis, Yu, and Nancy</p>
          <p>
            <a className="icon" href="https://github.com/Myach-FSA/Capstone">
              <i className="fa fa-github"></i>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
