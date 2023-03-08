import { Board } from './board';
import { Bishop } from './bishop';
import { Move } from './move';
import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';
import { Square } from './square';
import { Rook } from './rook';

export class Queen extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = '/assets/images/white-queen.png';
    } else {
      this.imgUrl = '/assets/images/black-queen.png';
    }
  }
  override checkLegalMoves(board: Board, enemyMoves: boolean = false): Move[] {
    const squares = board.squares;
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare && currSquare.occupiedBy) {
      const tempRook = new Rook(currSquare.occupiedBy.isWhite, currSquare.position);
      const tempBishop = new Bishop(currSquare.occupiedBy.isWhite, currSquare.position);
      return [...tempBishop.addMove(currSquare, board, false, false, enemyMoves),
        ...tempBishop.addMove(currSquare, board, false, true, enemyMoves),
        ...tempBishop.addMove(currSquare, board, true, false, enemyMoves),
        ...tempBishop.addMove(currSquare, board, true, true, enemyMoves),
        ...tempRook.addMove(currSquare, board, false, true, enemyMoves),
        ...tempRook.addMove(currSquare, board, true, true, enemyMoves),
        ...tempRook.addMove(currSquare, board, false, false, enemyMoves),
        ...tempRook.addMove(currSquare, board, true, false, enemyMoves)
      ]
    }
    return [];
  }
}
