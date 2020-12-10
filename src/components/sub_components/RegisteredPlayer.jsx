export default function RegisteredPlayer(props) {
  return (
    <div className={`player-cell`}>
      <h3>{props.info.gamertag}</h3>

      <button onClick={() => props.addCallback(props.playerId)}>
        Add to game
      </button>
      <br/>
      <br/>

      <button onClick={() => console.log("this doesn't exist yet")}>
        Remove forever
      </button>
    </div>
  );
}
