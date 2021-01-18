export default function StatPlayer(props) {
  const {playerInfo, crewmate_data: crewmateData, imposter_data: imposterData} = props.playerData;
  return (
    <div className="player-cell">
      <h3>{playerInfo.gamertag}</h3>
      <div className="stats-display">
        <div className="role-stat">
          <h4>Crewmate</h4>
          <WinRecord record={crewmateData} />
        </div>
        <div className="role-stat">
          <h4>Imposter</h4>
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
