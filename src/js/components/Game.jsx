import { useState, useEffect } from 'react';

import * as boardService from '../services/board.services';

import { Actions } from './Actions';
import { Board } from './Board';
import { Info } from './Info';

export const Game = () => {
  const [game, setGame] = useState({
    white: 12,
    black: 12,
    isOn: false,
    isWhiteTurn: false,
  });
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  // const [enemies, setEnemies] = useState([]);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [possibleJumps, setPossibleJumps] = useState([]);

  useEffect(() => {
    //Inital Board
    const board = boardService.createBoard();
    setBoard(board);
  }, []);

  //Pawn Clicked
  const pawnClicked = (pawn) => {
    // Game validation
    if (!game.isOn) return;
    if (game.isWhiteTurn !== pawn.isWhite) return;

    // Unselect
    if (selected === pawn) {
      return setSelected(null);
    }
    // Select
    setSelected(pawn);

    // Get all possible moves
    let moves = {};

    if (pawn.isKing) {
      moves = boardService.getAllPossibleKingMoves(board, pawn);
    } else {
      moves = boardService.getAllPossibleMoves(board, pawn);
    }

    const { possibleMoves, possibleJumps } = moves;

    //set state
    setPossibleMoves(possibleMoves);
    setPossibleJumps(possibleJumps);
  };

  //Empty Clicked
  const emptyClicked = (x, y) => {
    const clickedCell = { y, x };
    //possibleMoves

    const isPossibleJump = possibleJumps?.some((jump) => {
      return JSON.stringify(jump) === JSON.stringify(clickedCell);
    });
    const isPossibleMove = possibleMoves?.some((move) => {
      return JSON.stringify(move) === JSON.stringify(clickedCell);
    });

    if (!isPossibleMove && !isPossibleJump) return;

    if (!selected) return;

    if (possibleJumps?.length) {
      boardService.removeEnemy(board, selected, clickedCell);
      const newBoard = boardService.movePiece(board, selected, clickedCell);
      const enemy = game.isWhiteTurn ? 'black' : 'white';

      setGame({
        ...game,
        enemy: game[enemy]--,
        isWhiteTurn: !game.isWhiteTurn,
      });
      setBoard(newBoard);

      if (!game[enemy]) return isWin();
    } else {
      const newBoard = boardService.movePiece(board, selected, clickedCell);
      setGame({ ...game, isWhiteTurn: !game.isWhiteTurn });
      setBoard(newBoard);
    }

    // check isWin

    // game.white === 0 ? 'Black Win' : game.black === 0 ? 'White Win' : false
    if (possibleMoves) setSelected(null);
    setPossibleMoves(null);
  };

  const isWin = () => {
    const winner = game.isWhiteTurn ? 'White' : 'Black';
    setGame({ ...game, isOn: false });
    resetGame();
    console.log('winner', winner);
  };

  const resetGame = () => {
    setGame({
      white: 12,
      black: 12,
      isOn: false,
      isWhiteTurn: false,
    });
    setSelected(null);
    const board = boardService.createBoard();
    setBoard(board);
    setPossibleMoves(null);
  };

  const startGame = () => {
    if (game.isOn) return resetGame();
    setGame({ ...game, isOn: !game.isOn });
  };

  return (
    <div className="game flex column auto-center">
      <Info game={game} />
      <Board
        board={board}
        selected={selected}
        pawnClicked={pawnClicked}
        emptyClicked={emptyClicked}
      />
      <Actions startGame={startGame} game={game} />
    </div>
  );
};
