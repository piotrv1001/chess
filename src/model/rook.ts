import { Move } from './move';
import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';
import { Square } from './square';
import { King } from './king';
import { Board } from './board';

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
  override checkLegalMoves(board: Board): Move[] {
    const squares = board.squares;
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare) {
      return [...this.addMove(currSquare, board, false, true),
        ...this.addMove(currSquare, board, true, true),
        ...this.addMove(currSquare, board, false, false),
        ...this.addMove(currSquare, board, true, false)
      ]
    }
    return [];
  }
  addMove(currSquare: Square, board: Board, increment: boolean, isRow: boolean): Move[] {
    const squares = board.squares;
    const moves: Move[] = [];
    let row = currSquare.position.row;
    let col = currSquare.position.column;
    const multiplier = (increment) ? 1 : -1;
    const pathToCheck: Square[] = [];
    while(col >= 1 && col <= 8 && row >= 1 && row <= 8) {
      (isRow) ? row += multiplier : col += multiplier;
      const foundSquare = squares.find(square => square.position.row === row && square.position.column === col);
      const occupiedByEnemy = (foundSquare?.occupiedBy?.isWhite !== currSquare.occupiedBy?.isWhite);
      if(foundSquare && (foundSquare.occupiedBy == null || occupiedByEnemy)) {
        if(currSquare.occupiedBy) {
          const move = new Move(currSquare, foundSquare, currSquare.occupiedBy);
          moves.push(move);
          pathToCheck.push(foundSquare);
          if(foundSquare.occupiedBy != null && occupiedByEnemy) {
            if(foundSquare.occupiedBy instanceof King) { // enemy king is in check -> return path to check
              board.pathToCheck = [currSquare, ...pathToCheck];
            } else {
              break;
            }
          }
        }
      } else { // we encountered our own piece
        break;
      }
    }
    return moves;
  }
}
