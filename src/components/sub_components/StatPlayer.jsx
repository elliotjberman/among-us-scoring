import {calculateWinPercentage} from '../../utils';


export default function StatPlayer(props) {
  const {rank} = props;
  const {playerInfo, crewmate_data: crewmateData, imposter_data: imposterData, games_played: gamesPlayed} = props.playerData;
  return (
    <div className="player-cell">
      <h3>{rank}. {playerInfo.gamertag} | {gamesPlayed} Total Games</h3>
      <div className="stats-display">
        <div className="role-stat">
          <h4>Crewmate | {calculateWinPercentage(crewmateData)}%</h4>
          <WinRecord record={crewmateData} />
        </div>
        <div className="role-stat">
          <h4>Imposter | {calculateWinPercentage(imposterData)}%</h4>
          <WinRecord record={imposterData} />
        </div>
      </div>
    </div>
  );
}

const WinRecord = (props) => {
  const {win_count: winCount, loss_count: lossCount} = props.record;
  return (
    <div className="stat-cell">
      <h5 className="wins">{winCount}</h5>
      <h5 className="losses">{lossCount}</h5>
    </div>
  )
}
