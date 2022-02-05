import logo from '../../assets/img/checkers.svg';

export const Info = ({ game }) => {
  const { isWhiteTurn, isOn } = game;
  return (
    <div className="info flex">
      <img src={logo} alt="" />
      <div className={`turn flex auto-center ${isWhiteTurn ? '' : 'black'}`}>
        {!isOn ? 'Checkers Game' : isWhiteTurn ? 'White Turn' : 'Black Turn'}
      </div>
    </div>
  );
};
