import { Move } from './move';
import { Pawn } from './pawn';
import { King } from './king';
import { Queen } from './queen';
import { Bishop } from './bishop';
import { Position } from 'src/app/types/position';
import { Knight } from './knight';
import { Rook } from './rook';
import { Square } from './square';

export class Board {
  squares: Square[];
  lastMove?: Move;
  legalMoves: Map<Square, Move[]> = new Map();
  isCheckMate: boolean = false;
  constructor() {
    this.squares = this.initSquares();
  }
  private checkIfCheckmate(isWhite: boolean): boolean {
    for(const square of this.squares) {
      if(square.occupiedBy == null) continue;
      else if(square.occupiedBy.isWhite === isWhite) {
        const moves = square.occupiedBy.checkLegalMoves(this.squares);
        this.legalMoves?.set(square, moves);
      }
    }
    return this.legalMoves?.size === 0;
  }
  makeMove(move: Move): void {
    const startingPos = this.squares.find(square => square.position === move.startingPos.position);
    const endingPos = this.squares.find(square => square.position === move.endingPos.position);
    if(startingPos && endingPos) {
      startingPos.occupiedBy = null;
      endingPos.occupiedBy = move.piece;
      this.lastMove = move;
    }
    const isWhite = !move.piece.isWhite;
    this.isCheckMate = this.checkIfCheckmate(isWhite);
  }
  // check if the king of the player who just made a move is in check -> if yes, that move is illegal
  isKingInCheck(): boolean {
    const isWhite = this.lastMove?.piece.isWhite;
    const kingSquare = this.squares.find(square => square.occupiedBy instanceof King && square.occupiedBy.isWhite === isWhite);
    if(kingSquare) {
      const legalMoves = this.lastMove?.piece.checkLegalMoves(this.squares);
      if(legalMoves) {
        return legalMoves.find(move => move.endingPos === kingSquare) !== undefined;
      }
    }
    return false;
  }
  private initSquares(): Square[] {
    const initialSquares: Square[] = [];
    let isSquareWhite = true;
    for(let row = 1; row <= 8; row++) {
      isSquareWhite = !isSquareWhite;
      for(let col = 1; col <= 8; col++) {
        isSquareWhite = !isSquareWhite;
        const position: Position = { row: row, column: col };
        if(row === 1 || row === 8) {
          const isWhite = (row === 8);
          if(col === 1 || col === 8) {
            const rook = new Rook(isWhite, position);
            const square = new Square(position, isSquareWhite, rook);
            initialSquares.push(square);
          } else if(col === 2 || col === 7) {
            const knight = new Knight(isWhite, position);
            const square = new Square(position, isSquareWhite, knight);
            initialSquares.push(square);
          } else if(col === 3 || col === 6) {
            const bishop = new Bishop(isWhite, position);
            const square = new Square(position, isSquareWhite, bishop);
            initialSquares.push(square);
          } else if(col === 4) {
            const queen = new Queen(isWhite, position);
            const square = new Square(position, isSquareWhite, queen);
            initialSquares.push(square);
          } else {
            const king = new King(isWhite, position);
            const square = new Square(position, isSquareWhite, king);
            initialSquares.push(square);
          }
        } else if(row === 2 || row === 7) {
          const isWhite = (row === 7);
          const pawn = new Pawn(isWhite, position);
          const square = new Square(position, isSquareWhite, pawn);
          initialSquares.push(square);
        } else {
          const square = new Square(position, isSquareWhite);
          initialSquares.push(square);
        }
      }
    }
    return initialSquares;
  }
}
