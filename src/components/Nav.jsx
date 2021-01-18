import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";


import '../Nav.scss'

const Nav = () => {
  return (
    <nav>
      <Link to="/score_entry">Score Entry</Link>
      <Link to="/stats_viewer">Stats Viewer</Link>
    </nav>
  )
}

export default Nav;
