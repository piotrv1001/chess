import { Move } from './move';
import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';
import { Square } from './square';

export class Pawn extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = '/assets/images/white-pawn.png';
    } else {
      this.imgUrl = '/assets/images/black-pawn.png';
    }
  }
  override checkLegalMoves(squares: Square[]): Move[] {
    const moves: Move[] = [];
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare) {
      const currPos = currSquare.position;
      const upperLimit = (this.isWhite) ? 7 : 2;
      const multiplier = (this.isWhite) ? -1 : 1;
      if(currPos.row > 1 && currPos.row < 8) {
        // base case -> move up/down by 1 square
        const pos = { row: currPos.row + 1 * multiplier, column: currPos.column };
        const move = this.addMove(pos, squares, currSquare);
        if(move) {
          moves.push(move);
        }
        // handle captures
        const leftPos = { row: currPos.row + 1 * multiplier, column: currPos.column - 1 };
        const rightPos = { row: currPos.row + 1 * multiplier, column: currPos.column + 1 };
        const captureLeft = this.addMove(leftPos, squares, currSquare, true);
        const captureRight = this.addMove(rightPos, squares, currSquare, true);
        if(captureLeft) {
          moves.push(captureLeft);
        }
        if(captureRight) {
          moves.push(captureRight);
        }
        // handle moving up/down by 2 squares
        if(currPos.row === upperLimit) {
          const pos = { row: currPos.row + 2 * multiplier, column: currPos.column };
          const move = this.addMove(pos, squares, currSquare);
          if(move) {
            moves.push(move);
          }
        }
      }
    }
    return moves;
  }
  private addMove(pos: Position, squares: Square[], currSquare: Square, isCapture: boolean = false): Move | null {
    const foundSquare = squares.find(square => square.position.row === pos.row && square.position.column === pos.column);
    if(foundSquare && ((foundSquare.occupiedBy == null && !isCapture) || (foundSquare.occupiedBy != null && isCapture))) {
      return new Move(currSquare, foundSquare, this);
    }
    return null;
  }
}
