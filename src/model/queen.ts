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
  override checkLegalMoves(board: Board): Move[] {
    const squares = board.squares;
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare && currSquare.occupiedBy) {
      const tempRook = new Rook(currSquare.occupiedBy.isWhite, currSquare.position);
      const tempBishop = new Bishop(currSquare.occupiedBy.isWhite, currSquare.position);
      return [...tempBishop.addMove(currSquare, board, false, false),
        ...tempBishop.addMove(currSquare, board, false, true),
        ...tempBishop.addMove(currSquare, board, true, false),
        ...tempBishop.addMove(currSquare, board, true, true),
        ...tempRook.addMove(currSquare, board, false, true),
        ...tempRook.addMove(currSquare, board, true, true),
        ...tempRook.addMove(currSquare, board, false, false),
        ...tempRook.addMove(currSquare, board, true, false)
      ]
    }
    return [];
  }
}
