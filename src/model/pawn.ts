import { EnPassant } from './en-passant';
import { Board } from './board';
import { Move } from './move';
import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';
import { Square } from './square';

export class Pawn extends ChessEntity {
  moveCounter: number;
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    this.moveCounter = 0;
    if(isWhite) {
      this.imgUrl = '/assets/images/white-pawn.png';
    } else {
      this.imgUrl = '/assets/images/black-pawn.png';
    }
  }
  override checkLegalMoves(board: Board, enemyMoves: boolean = false): Move[] {
    const squares = board.squares;
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
        if(enemyMoves) {
          const leftSquare = squares.find(square => square.position.row === leftPos.row && square.position.column === leftPos.column);
          const rightSquare = squares.find(square => square.position.row === rightPos.row && square.position.column === rightPos.column);
          if(leftSquare) {
            const moveLeft = new Move(currSquare, leftSquare, this);
            moves.push(moveLeft);
          }
          if(rightSquare) {
            const moveRight = new Move(currSquare, rightSquare, this);
            moves.push(moveRight);
          }
        }
        // handle moving up/down by 2 squares
        if(currPos.row === upperLimit) {
          const pos = { row: currPos.row + 2 * multiplier, column: currPos.column };
          const move = this.addMove(pos, squares, currSquare);
          if(move) {
            moves.push(move);
          }
        }
        // handle en passant
        const left = { row: currPos.row, column: currPos.column - 1 };
        const squareLeft = squares.find(square => square.position.row === left.row && square.position.column === left.column);
        const destinationLeft = squares.find(square => square.position.row === left.row + 1 * multiplier && square.position.column === left.column);
        const squareLeftPiece = squareLeft?.occupiedBy;
        if(squareLeft && destinationLeft && squareLeftPiece instanceof Pawn && squareLeftPiece.isWhite !== this.isWhite && squareLeftPiece.moveCounter === 1) {
          const move = new EnPassant(currSquare, destinationLeft, this);
          moves.push(move);
        }
        const right = { row: currPos.row, column: currPos.column + 1 };
        const squareRight = squares.find(square => square.position.row === right.row && square.position.column === right.column);
        const destinationRight = squares.find(square => square.position.row === right.row + 1 * multiplier && square.position.column === right.column);
        const squareRightPiece = squareRight?.occupiedBy;
        if(squareRight && destinationRight && squareRightPiece instanceof Pawn && squareRightPiece.isWhite !== this.isWhite && squareRightPiece.moveCounter === 1) {
          const move = new EnPassant(currSquare, destinationRight, this);
          moves.push(move);
        }
      }
    }
    return moves;
  }
  private addMove(pos: Position, squares: Square[], currSquare: Square, isCapture: boolean = false): Move | null {
    const foundSquare = squares.find(square => square.position.row === pos.row && square.position.column === pos.column);
    if(foundSquare && ((foundSquare.occupiedBy == null && !isCapture) ||
     (foundSquare.occupiedBy != null && isCapture && foundSquare.occupiedBy.isWhite !== currSquare.occupiedBy?.isWhite))) {
      return new Move(currSquare, foundSquare, this);
    }
    return null;
  }
}
