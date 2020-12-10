import React from 'react';

import Player from './sub_components/Player';
import '../ScoreSheet.css'

const CREW_WIN = 0;
const IMPOSTER_WIN = 1;

class ScoreSheet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: {
        "z": {},
        "bermang": {},
        "Loki": {},
        "lisshay": {},
        "a": {}
      },
      winner: CREW_WIN
    };

    this.toggleImposter = this.toggleImposter.bind(this);
    this.toggleWinner = this.toggleWinner.bind(this);
    this.submitResults = this.submitResults.bind(this);
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

    if (Object.values(updatedPlayers).filter(info => info.isImposter).length > 3) {
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
    const backendResult = {};
    Object.entries(this.state.players).forEach(([id, info]) => {
      const keyName = this.state.players[id].isImposter ? "imposter" : "crew";
      backendResult[id] = {[keyName]: this.playerWon(id) ? "+1" : "-1"}
    });

    alert(JSON.stringify(backendResult, null, 2));
  }

  playerWon(playerId) {
    if (this.state.players[playerId].isImposter) return this.state.winner === IMPOSTER_WIN;
    return this.state.winner === CREW_WIN;
  }

  render() {
    let playerEntries = Object.entries(this.state.players);
    playerEntries = playerEntries.sort((a,b) => {
      return a[0].toLowerCase().localeCompare(b[0].toLowerCase());
    });
    const playerCells = playerEntries.map(([id, info]) => <Player key={id} playerId={id} info={info} imposterCallback={this.toggleImposter}/> );

    return (
      <div>
        <h1>Score Sheet</h1>
        <button onClick={this.submitResults}>
          Submit Results
        </button>
        <h2>Players</h2>
        {playerCells}

        <h2>Who won? (Currently set to {this.state.winner === CREW_WIN ? "Crew" : "Imposter"})</h2>
        <button onClick={this.toggleWinner}>
          No, {this.state.winner === CREW_WIN ? "Imposter(s)" : "Crew"} won
        </button>
      </div>
    );
  }

};

export default ScoreSheet;
