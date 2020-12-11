import React from 'react';
import axios from 'axios';
import urljoin from 'url-join';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import GamePlayer from './sub_components/GamePlayer';
import RegisteredPlayer from './sub_components/RegisteredPlayer';
import '../ScoreSheet.css'

const CREW_WIN = 0;
const IMPOSTER_WIN = 1;

// TODO: Dictionary vs Array?
const registeredPlayers = [
  {_id: "1", gamertag: "z"},
  {_id: "2", gamertag: "bermang"},
  {_id: "3", gamertag: "Loki"},
  {_id: "4", gamertag: "lisshay"},
  {_id: "5", gamertag: "a"}
]

class ScoreSheet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: {
      },
      allPlayers: {},
      winner: CREW_WIN,
      imposterCount: 1
    };

    this.toggleImposter = this.toggleImposter.bind(this);
    this.toggleWinner = this.toggleWinner.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.submitResults = this.submitResults.bind(this);
  }

  async componentDidMount() {
    const response = await axios.get(urljoin(process.env.REACT_APP_SESSION_SVC, "players"));
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
    const adjustedPlayers = this.players.map(player => {return {id: player.id}});
    await this.setState({player: adjustedPlayers, winner: null});
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
    await this.setState({winner: Number(!this.state.winner)});
  }

  async submitResults() {
    const cleanedPlayers = Object.values(this.state.players).map(playerInfo => ({player_id: playerInfo.id}));
    const sessionData = {
      players: cleanedPlayers,
      winner: this.state.winner,
      imposterIds: Object.values(this.state.players).filter(player => player.isImposter).map(player => ({player_id: player.id})),
    }
    if (this.state.imposterCount != sessionData.imposterIds.length) {
      alert(`Wrong number of imposters; expected ${this.state.imposterCount} but got ${sessionData.imposterIds.length}`);
      return;
    }

    const response = await axios.post(urljoin(process.env.REACT_APP_SESSION_SVC, "sessions/"), {session: sessionData});
  }

  addPlayer(playerId) {
    const updatedPlayers = {... this.state.players};
    updatedPlayers[playerId] = this.state.allPlayers[playerId];
    this.setState({players: updatedPlayers});
  }

  removePlayer(playerId) {
    const updatedPlayers = {... this.state.players};
    delete updatedPlayers[playerId];
    this.setState({players: updatedPlayers});
  }

  playerWon(playerId) {
    if (this.state.players[playerId].isImposter) return this.state.winner === IMPOSTER_WIN;
    return this.state.winner === CREW_WIN;
  }

  render() {
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
        <h1>Score Sheet</h1>
        <h2>How many imposters?</h2>
        <div style={{width: "25%"}}>
          <Dropdown options={[1,2,3]} onChange={(value) => this.setState({imposterCount: value.value}) } value={this.state.imposterCount} placeholder="Select 1-3" />
        </div>
        <h2>Who won? (Currently set to {this.state.winner === CREW_WIN ? "Crew" : "Imposter"})</h2>
        <button onClick={this.toggleWinner}>
          No, {this.state.winner === CREW_WIN ? "Imposter(s)" : "Crew"} won
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

export default ScoreSheet;
