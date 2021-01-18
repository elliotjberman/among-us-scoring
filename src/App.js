import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.scss';
import Nav from './components/Nav';
import Home from './components/Home';
import ScoreEntry from './components/ScoreEntry';
import StatsViewer from './components/StatsViewer';


function App() {
  return (
    <div className="App">
      <Router>
        <Nav />

        <Switch>

          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/score_entry">
            <ScoreEntry />
          </Route>


          <Route path="/stats_viewer">
            <StatsViewer />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
