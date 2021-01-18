import React from 'react';
import axios from 'axios';
import urljoin from 'url-join';

import {sortCaseInsensitive, sortNumbers, calculateWinPercentage} from '../utils';

import StatPlayer from './sub_components/StatPlayer';
import './StatsViewer.scss';

// TODO: Deal with NaN's

class StatsViewer extends React.Component {
  static sorts = {
    // gamertag: {
    //   label: "Gamertag",
    //   lambda: ([aId, aData],[bId, bData]) => { return sortCaseInsensitive(aData.playerInfo.gamertag, bData.playerInfo.gamertag) }
    // },
    totalGames: {
      label: "Total Games Played",
      lambda: ([aId, aData],[bId, bData]) => { return sortNumbers(aData.games_played, bData.games_played) }
    },
    crewmateWins: {
      label: "Crewmate Wins",
      lambda: ([aId, aData],[bId, bData]) => { return sortNumbers(aData.crewmate_data.win_count, bData.crewmate_data.win_count) }
    },
    crewmateRatio: {
      label: "Crewmate Win/Loss %",
      lambda: ([aId, aData],[bId, bData]) => { return sortNumbers(calculateWinPercentage(aData.crewmate_data), calculateWinPercentage(bData.crewmate_data)) }
    },
    imposterWins: {
      label: "Imposter Wins",
      lambda: ([aId, aData],[bId, bData]) => { return sortNumbers(aData.imposter_data.win_count, bData.imposter_data.win_count) }
    },
    imposterRatio: {
      label: "Imposter Win/Loss %",
      lambda: ([aId, aData],[bId, bData]) => { return sortNumbers(calculateWinPercentage(aData.imposter_data), calculateWinPercentage(bData.imposter_data)) }
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      players: {},
      sortingKey: "totalGames",
      minGames: 0
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

  async selectSort(sortingKey) {
    this.setState({sortingKey});
  }

  async handleChange(event) {
    await this.setState({minGames: event.target.value});
  }

  render() {
    const playerEntries = Object.entries(this.state.players).filter(([playerId, playerData]) => playerData.games_played >= this.state.minGames);
    playerEntries.sort(StatsViewer.sorts[this.state.sortingKey].lambda);

    return (
      <div>
        <h1>Stats Viewer</h1>
        <h2>Minimum Games: {this.state.minGames}</h2>
          <input
            id="typeinp"
            type="range"
            min="0" max={Math.max(...playerEntries.map(([playerId, playerData]) => playerData.games_played)) }
            value={this.state.minGames}
            onChange={(e) => this.handleChange(e)}
            step="1"/>
        <h2>Sorted by {StatsViewer.sorts[this.state.sortingKey].label}</h2>
        <div className="sorts-container">
          {
            Object.entries(StatsViewer.sorts).map(([sortingKey, sortData]) => {
              return <SortButton key={sortingKey} sortData={sortData} selected={sortingKey===this.state.sortingKey} clickCallback={() => this.selectSort(sortingKey)} />
            })
          }
        </div>
        {playerEntries.map(([playerId, playerData], i) => <StatPlayer key={playerId} playerData={playerData} rank={i+1} />)}
      </div>
    )
  }

};

const SortButton = (props) => {
  const {selected, clickCallback} = props;
  const {label} = props.sortData;
  return (
    <div className={`sort-button ${selected ? "selected": ""}`} onClick={clickCallback}>
      {label}
    </div>
  )
}

export default StatsViewer;
