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
  override checkLegalMoves(squares: Square[]): Move[] {
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare && currSquare.occupiedBy) {
      const tempRook = new Rook(currSquare.occupiedBy.isWhite, currSquare.position);
      const tempBishop = new Bishop(currSquare.occupiedBy.isWhite, currSquare.position);
      const currPos = currSquare.position;
      const row = currPos.row;
      const col = currPos.column;
      const conditionTopLeft = (row >= 1 && col >= 1);
      const conditionTopRight = (row >= 1 && col <= 8);
      const conditionBottomLeft = (row <= 8 && col >= 1);
      const conditionBottomRight = (row <= 8 && col <= 8);
      const conditionLeft = (row >= 1);
      const conditionRight = (row <= 8);
      const conditionBottom = (col >= 1);
      const conditionTop = (col <= 8);
      return [...tempBishop.addMove(currSquare, squares, conditionTopLeft, false, false),
        ...tempBishop.addMove(currSquare, squares, conditionTopRight, false, true),
        ...tempBishop.addMove(currSquare, squares, conditionBottomLeft, true, false),
        ...tempBishop.addMove(currSquare, squares, conditionBottomRight, true, true),
        ...tempRook.addMove(currSquare, squares, conditionLeft, false, true),
        ...tempRook.addMove(currSquare, squares, conditionRight, true, true),
        ...tempRook.addMove(currSquare, squares, conditionBottom, false, false),
        ...tempRook.addMove(currSquare, squares, conditionTop, true, false)
      ]
    }
    return [];
  }
}
