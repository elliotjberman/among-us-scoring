export default function Player(props) {
  return (
    <div className={`player-cell ${props.info.isImposter ? "imposter" : null}`}>
      <h3>{props.playerId}</h3>

      <button onClick={() => props.imposterCallback(props.playerId)}>
        {props.info.isImposter ? "Was Not Imposter" : "Was Imposter"}
      </button>
    </div>
  );
}
