//Initial Game
export const createBoard = () => {
    const axisY = [0, 1, 2, 3, 4, 5, 6, 7];
    const axisX = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const board = [];

    axisY.forEach((y, yIdx) => {
        board[yIdx] = []
        axisX.forEach((x, xIdx) => {
            const pawn = _placePawn(yIdx, xIdx)
            // const cell = { yIdx, xIdx, ...pawn }
            board[yIdx][xIdx] = pawn;
        })
    })
    return board;
}

const createPlayer = (name, isWhite) => {
    return {
        name,
        id: _makeId(),
        isWhite,
        pawns: _createPawns(isWhite)
    }
}

const _createPawns = (isWhite, yIdx, xIdx) => {
    return {
        id: _makeId(),
        isWhite,
        isKing: false,
        yIdx, xIdx
    }
}

const _createPawn = (isWhite, yIdx, xIdx) => {
    return {
        id: _makeId(),
        isWhite,
        isKing: false,
        yIdx, xIdx
    }
}

const _placePawn = (yIdx, xIdx) => {
    const squareOdd = isOdd(yIdx + xIdx);
    const pawn = (yIdx < 3 && squareOdd) ? _createPawn(false, yIdx, xIdx) : (yIdx > 4 && squareOdd) ? _createPawn(true, yIdx, xIdx) : '';
    return pawn
}

export const movePiece = (board, pawn, cell) => {
    // pawm.isKing
    const { isWhite, isKing, yIdx, xIdx } = pawn
    const { x, y } = cell

    if (isWhite && y === 0 || !isWhite && y === board.length - 1) pawn.isKing = true;

    board[y][x] = pawn;
    board[yIdx][xIdx] = '';
    pawn.yIdx = y;
    pawn.xIdx = x;

    return JSON.parse(JSON.stringify(board))
}

export const removeEnemy = (board, selected, clickedCell) => {
    const x = Math.max(selected.xIdx, clickedCell.x)
    const y = Math.max(selected.yIdx, clickedCell.y)

    const cell = { x: x - 1, y: y - 1 }
    board[cell.y][cell.x] = ''

    return JSON.parse(JSON.stringify(board))
}

//possible moves
export const getAllPossibleMoves = (board, pawn) => {
    const { yIdx, xIdx, isWhite } = pawn;
    const possibleMoves = [];
    let possibleJumps = [];

    const diff = isWhite ? -1 : 1;
    const line = yIdx + diff;

    const moves = [
        { y: line, x: xIdx - 1 },
        { y: line, x: xIdx + 1 },
    ]

    moves.forEach(move => {
        if (_isEmptyCell(board, move)) {
            possibleMoves.push(move);
        } else {
            possibleJumps = _checkJump(board, move, pawn, possibleJumps, diff);
        }
    })
    return { possibleMoves, possibleJumps };
}

export const getAllPossibleKingMoves = (board, pawn) => {
    const { yIdx, xIdx, isWhite } = pawn;
    const possibleMoves = [];
    let possibleJumps = [];
    const diff = isWhite ? -1 : 1;

    // up right
    let y = yIdx - 1;
    for (let idx = xIdx + 1; y >= 0 && idx < 8; idx++) {
        let move = { y: y--, x: idx };
        if (_isEmptyCell(board, move)) {
            possibleMoves.push(move);
        } else {
            possibleJumps = _checkJump(board, move, pawn, possibleJumps, diff)
            break;
        }
    }
    // up left
    y = yIdx - 1;
    for (let idx = xIdx - 1; y >= 0 && idx >= 0; idx--) {
        let move = { y: y--, x: idx };
        if (_isEmptyCell(board, move)) {
            possibleMoves.push(move);
        } else {
            possibleJumps = _checkJump(board, move, pawn, possibleJumps, diff)
            break;
        }
    }
    // down right
    y = yIdx + 1;
    for (let idx = xIdx + 1; y < 8 && idx < 8; idx++) {
        let move = { y: y++, x: idx };
        if (_isEmptyCell(board, move)) {
            possibleMoves.push(move);
        } else {
            possibleJumps = _checkJump(board, move, pawn, possibleJumps, diff)
            break;
        }
    }
    // down left
    y = yIdx + 1;
    for (let idx = xIdx - 1; y < 8 && idx >= 0; idx--) {
        let move = { y: y++, x: idx };
        if (_isEmptyCell(board, move)) {
            possibleMoves.push(move);
        } else {
            possibleJumps = _checkJump(board, move, pawn, possibleJumps, diff)
            break;
        }
    }

    return { possibleMoves, possibleJumps };
}

const _checkJump = (board, move, pawn, possibleJumps, diff) => {
    const { xIdx, yIdx, isWhite, isKing } = pawn

    const isEnemy = board[move.y][move.x]?.isWhite !== isWhite;

    if (isEnemy) {
        let finalY;
        if (isKing) {
            const isDown = move.y > yIdx ? true : false;
            finalY = isDown ? move.y + 1 : move.y - 1;
        } else {
            finalY = move.y + diff;
        }
        const isRight = move.x > xIdx ? true : false;
        const finalX = isRight ? move.x + 1 : move.x - 1;

        _isEmptyCell(board, { y: finalY, x: finalX }) && possibleJumps.push({ y: finalY, x: finalX });
    }
    return possibleJumps
}


//Utils
const _isEmptyCell = (board, { y, x }) => {
    if (y < 0 || y > board.length - 1) return
    if (x < 0 || x > board.length - 1) return
    return board[y][x] === ''
}

export const isOdd = (n) => {
    return Math.abs(n % 2) === 1;
}

const _makeId = (n = 5) => {
    return (Math.random() + 1).toString(36).substring(n);
}