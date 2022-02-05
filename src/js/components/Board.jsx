import { Square } from './Square';

export const Board = ({ board, selected, pawnClicked, emptyClicked }) => {
  return (
    <div className="board flex">
      {board.map((row, rowIdx) => {
        return row.map((pawn, colIdx) => {
          return (
            <Square
              key={colIdx}
              pawn={pawn}
              rowIdx={rowIdx}
              colIdx={colIdx}
              selected={selected}
              pawnClicked={pawnClicked}
              emptyClicked={emptyClicked}
            />
          );
        });
      })}
    </div>
  );
};
