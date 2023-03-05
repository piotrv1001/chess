import { Move } from './move';
import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';
import { Square } from './square';

export class Rook extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = '/assets/images/white-rook.png';
    } else {
      this.imgUrl = '/assets/images/black-rook.png';
    }
  }
  override checkLegalMoves(squares: Square[]): Move[] {
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare) {
      const currPos = currSquare.position;
      const row = currPos.row;
      const col = currPos.column;
      const conditionLeft = (row >= 1);
      const conditionRight = (row <= 8);
      const conditionBottom = (col >= 1);
      const conditionTop = (col <= 8);
      return [...this.addMove(currSquare, squares, conditionLeft, false, true),
        ...this.addMove(currSquare, squares, conditionRight, true, true),
        ...this.addMove(currSquare, squares, conditionBottom, false, false),
        ...this.addMove(currSquare, squares, conditionTop, true, false)
      ]
    }
    return [];
  }
  addMove(currSquare: Square, squares: Square[], condition: boolean, increment: boolean, isRow: boolean): Move[] {
    const moves: Move[] = [];
    let row = currSquare.position.row;
    let col = currSquare.position.column;
    const multiplier = (increment) ? 1 : -1;
    while(condition) {
      (isRow) ? row += multiplier : col += multiplier;
      const foundSquare = squares.find(square => square.position.row === row && square.position.column === col);
      const occupiedByEnemy = (foundSquare?.occupiedBy?.isWhite !== currSquare.occupiedBy?.isWhite);
      if(foundSquare && (foundSquare.occupiedBy == null || occupiedByEnemy)) {
        if(currSquare.occupiedBy) {
          const move = new Move(currSquare, foundSquare, currSquare.occupiedBy);
          moves.push(move);
          if(foundSquare.occupiedBy != null && occupiedByEnemy) {
            break;
          }
        }
      } else {
        break;
      }
    }
    return moves;
  }
}
