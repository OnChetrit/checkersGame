import { isOdd } from '../services/board.services';

export const Square = ({
  pawn,
  colIdx,
  rowIdx,
  selected,
  pawnClicked,
  emptyClicked,
}) => {
  const { isWhite, isKing } = pawn;
  const cellIdxSum = colIdx + rowIdx;

  return (
    <div
      className={`square flex auto-center ${isOdd(cellIdxSum) ? 'odd' : ''} ${
        selected === pawn ? 'selected' : ''
      }`}
      onClick={() => (pawn ? pawnClicked(pawn) : emptyClicked(colIdx, rowIdx))}
    >
      {pawn && (
        <div
          className={`pawn flex auto-center btn ${
            isWhite ? 'w-pawn' : 'b-pawn'
          }`}
        >
          {isKing && '👑'}
        </div>
      )}
    </div>
  );
};
