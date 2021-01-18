import React from 'react';
import {
  NavLink
} from "react-router-dom";

import './Nav.scss'

const Nav = () => {
  return (
    <nav>
      <NavLink exact to="/" activeClassName="selected">Home</NavLink>
      <NavLink to="/score_entry" activeClassName="selected">Score Entry</NavLink>
      <NavLink to="/stats_viewer" activeClassName="selected">Stats Viewer</NavLink>
    </nav>
  )
}

export default Nav;
