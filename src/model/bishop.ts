import { Move } from './move';
import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';
import { Square } from './square';

export class Bishop extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = '/assets/images/white-bishop.png';
    } else {
      this.imgUrl = '/assets/images/black-bishop.png';
    }
  }
  override checkLegalMoves(squares: Square[]): Move[] {
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare) {
      return [...this.addMove(currSquare, squares, false, false),
        ...this.addMove(currSquare, squares, false, true),
        ...this.addMove(currSquare, squares, true, false),
        ...this.addMove(currSquare, squares, true, true)
      ]
    }
    return [];
  }
  addMove(currSquare: Square, squares: Square[], rowIncrement: boolean, colIncrement: boolean): Move[] {
    const moves: Move[] = [];
    let row = currSquare.position.row;
    let col = currSquare.position.column;
    const rowMultiplier = (rowIncrement) ? 1 : -1;
    const colMultiplier = (colIncrement) ? 1 : -1;
    while(col >= 1 && col <= 8 && row >= 1 && row <= 8) {
      row += rowMultiplier;
      col += colMultiplier;
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
