import React from 'react';
import axios from 'axios';
import urljoin from 'url-join';

import StatPlayer from './sub_components/StatPlayer';
import './StatsViewer.scss';

class StatsViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: {}
    };
  }

  async componentDidMount() {
    await this.fetchStats();
  }

  async fetchStats() {
    const response = await axios.get(urljoin(process.env.REACT_APP_SESSION_SVC, "sessions/stats"));
    const {players} = response.data;
    const playerPromises = Object.entries(players).map(async ([playerId, playerEntry], i) => {
        const response = await axios.get(urljoin(process.env.REACT_APP_SESSION_SVC, "players/", playerId));
        players[playerId].playerInfo = response.data.player;
    });
    await Promise.all(playerPromises);
    this.setState({players});
  }

  render() {
    return (
      <div>
        <h1>Stats Viewer</h1>
        {Object.entries(this.state.players).map(([playerId, playerData], i) => <StatPlayer key={i} playerData={playerData} />)}
      </div>
    )
  }

};

export default StatsViewer;
