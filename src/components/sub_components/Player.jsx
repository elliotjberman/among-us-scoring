export default function Player(props) {
  return (
    <div className={`player-cell ${props.info.isImposter ? "imposter" : null}`}>
      <h3>{props.playerId} - {props.info.isImposter ? "Imposter" : "Crewmate"}</h3>

      <button onClick={() => props.imposterCallback(props.playerId)}>
        {props.info.isImposter ? "Was Not Imposter" : "Was Imposter"}
      </button>
      <br/>
      <br/>

      <button onClick={() => props.deleteCallback(props.playerId)}>
        Remove from session
      </button>
    </div>
  );
}
