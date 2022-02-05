export const Actions = ({ startGame, game }) => {
  const { isOn } = game;
  return (
    <div className="actions">
      <button onClick={startGame}>{isOn ? 'Reset' : 'Start'}</button>
    </div>
  );
};
