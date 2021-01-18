import React from 'react';
import axios from 'axios';
import urljoin from 'url-join';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import GamePlayer from './sub_components/GamePlayer';
import RegisteredPlayer from './sub_components/RegisteredPlayer';
import './ScoreEntry.scss';

const PASSWORD = "steadyeddie123"

class ScoreEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: {
      },
      allPlayers: {},
      impostersWon: false,
      imposterCount: 1,
      passwordEntered: false,
      password: ""
    };

    this.toggleImposter = this.toggleImposter.bind(this);
    this.toggleWinner = this.toggleWinner.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.submitResults = this.submitResults.bind(this);
  }

  async componentDidMount() {
    const response = await axios.get(urljoin(process.env.REACT_APP_SESSION_SVC, "players/"));
    const players = {}
    response.data.players.forEach(player => {
      players[player._id] = {
        gamertag: player.gamertag,
        id: player._id
      };
    });
    await this.setState({allPlayers: players});
  }

  async clearResults() {
    const players = {}
    Object.values(this.state.players).forEach(player => {
      players[player.id] = {
        gamertag: player.gamertag,
        id: player.id
      };
    });
    await this.setState({players, impostersWon: false});
  }

  async toggleImposter(playerId) {
    const prevPlayer = this.state.players[playerId];
    const updatedPlayer = {...prevPlayer, isImposter: !prevPlayer.isImposter};

    const updatedPlayers = {
      ...this.state.players,
      [playerId]: updatedPlayer
    };

    if (Object.values(updatedPlayers).filter(info => info.isImposter).length > this.state.imposterCount) {
      alert("Too many imposters");
      return;
    }

    await this.setState(prevState => ({
      ...prevState,
      players: updatedPlayers
    }));

  }

  async toggleWinner() {
    await this.setState({impostersWon: !this.state.impostersWon});
  }

  async submitResults() {
    const cleanedPlayers = Object.values(this.state.players).map(playerInfo => ({player_id: playerInfo.id, is_imposter: Boolean(playerInfo.isImposter)}));
    const sessionData = {
      players: cleanedPlayers,
      imposters_won: this.state.impostersWon,
    }
    const howManyImposters = Object.values(cleanedPlayers).filter(player => player.is_imposter).map(player => ({player_id: player.id})).length;
    if (this.state.imposterCount !== howManyImposters) {
      alert(`Wrong number of imposters; expected ${this.state.imposterCount} but got ${howManyImposters}`);
      return;
    }

    await axios.post(urljoin(process.env.REACT_APP_SESSION_SVC, "sessions/"), {session: sessionData});
    await this.clearResults();
  }

  async addPlayer(playerId) {
    const updatedPlayers = {...this.state.players};
    updatedPlayers[playerId] = this.state.allPlayers[playerId];
    await this.setState({players: updatedPlayers});
  }

  async removePlayer(playerId) {
    const updatedPlayers = {...this.state.players};
    delete updatedPlayers[playerId];
    await this.setState({players: updatedPlayers});
  }

  async handlePasswordChange(e) {
    await this.setState({password: e.target.value});
    await this.setState({passwordEntered: this.state.password === PASSWORD});
  }

  render() {
    if (!this.state.passwordEntered) {
      return (
        <div>
          <h1>Enter Password</h1>
          <input type="password" onChange={(e) => this.handlePasswordChange(e)} value={this.state.password} />
        </div>
      )
    }

    let playerEntries = Object.entries(this.state.players);
    playerEntries = playerEntries.sort((a,b) => {
      return a[1].gamertag.toLowerCase().localeCompare(b[1].gamertag.toLowerCase());
    });
    const playerCells = playerEntries.map(([id, info]) => <GamePlayer key={id} playerId={id} info={info} imposterCallback={this.toggleImposter} deleteCallback={this.removePlayer}/> );

    let registeredPlayerEntries = Object.entries(this.state.allPlayers).filter(([id, info]) => this.state.players[id] === undefined);
    registeredPlayerEntries = registeredPlayerEntries.sort((a,b) => {
      return a[1].gamertag.toLowerCase().localeCompare(b[1].gamertag.toLowerCase());
    });
    const registeredPlayerCells = registeredPlayerEntries.map(([id, info]) => <RegisteredPlayer key={id} playerId={id} info={info} addCallback={this.addPlayer}/> );

    return (
      <div>
        <h1>Score Entry</h1>
        <h2>How many imposters?</h2>
        <div style={{width: "25%"}}>
          <Dropdown options={[1,2,3]} onChange={(value) => this.setState({imposterCount: value.value}) } value={this.state.imposterCount} placeholder="Select 1-3" />
        </div>
        <h2>Who won? (Currently set to {this.state.impostersWon ? "Imposter" :  "Crew"})</h2>
        <button onClick={this.toggleWinner}>
          No, {this.state.impostersWon ? "Crew" : "Imposter(s)"} won
        </button><br/><br/>
        <button onClick={this.submitResults}>
          Submit Results
        </button>
        <div className="list-container">
          <div className="half-screen">
            <h2>Active Players</h2>
            {playerCells}
          </div>
          <div className="half-screen">
            <h2>Registered Players</h2>
            {registeredPlayerCells}
          </div>
        </div>
      </div>
    );
  }

};

export default ScoreEntry;
