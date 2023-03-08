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
  enemyMoves: Map<Square, Move[]> = new Map();
  isCheckMate: boolean = false;
  squaresAttackedByEnemey: Square[] = []; // to prevent the king from walking into a check
  pathToCheck: Square[] = []; // if we are in check we have to know the path to check, so every piece can only move onto that path to block the check
  constructor() {
    this.squares = this.initSquares();
    this.checkIfCheckmate(true);
  }
  private checkIfCheckmate(isWhite: boolean): boolean {
    this.calculateLegalMoves(isWhite);
    return this.legalMoves?.size === 0;
  }
  private calculateLegalMoves(isWhite: boolean): void {
    for(const square of this.squares) {
      if(square.occupiedBy == null) continue;
      else if(square.occupiedBy.isWhite !== isWhite) {
        const moves = square.occupiedBy.checkLegalMoves(this);
        this.enemyMoves?.set(square, moves);
      }
    }
    for(const square of this.squares) {
      if(square.occupiedBy == null) continue;
      if(square.occupiedBy.isWhite === isWhite) {
        let moves = square.occupiedBy.checkLegalMoves(this);
        if(this.pathToCheck.length > 0) {
          moves = moves.filter(move => this.pathToCheck.includes(move.endingPos));
        }
        this.legalMoves?.set(square, moves);
      }
    }
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
  isKingInLineOfCheck(): boolean {
    const isWhite = this.lastMove?.piece.isWhite;
    const kingSquare = this.squares.find(square => square.occupiedBy instanceof King && square.occupiedBy.isWhite === isWhite);
    if(kingSquare) {
      const legalMoves = this.lastMove?.piece.checkLegalMoves(this);
      if(legalMoves) {
        return legalMoves.find(move => move.endingPos === kingSquare) !== undefined;
      }
    }
    return false;
  }
  // isKingInCheck(): boolean {
  //   const isWhite = this.lastMove?.piece.isWhite ?? false;
  //   const kingSquare = this.squares.find(square => square.occupiedBy instanceof King && square.occupiedBy.isWhite === isWhite);
  //   if(kingSquare) {
  //     let row = kingSquare.position.row;
  //     let col = kingSquare.position.column;
  //     const left = this.checkDirection(isWhite, row, col, true, false);
  //     const right = this.checkDirection(isWhite, row, col, true, true);
  //     const top = this.checkDirection(isWhite, row, col, false, false, true);
  //     const bottom = this.checkDirection(isWhite, row, col, false, false, false);
  //     const topRight = this.checkDirectionDiagonally(isWhite, row, col, true, true);
  //     const topLeft = this.checkDirectionDiagonally(isWhite, row, col, false, true);
  //     const bottomRight = this.checkDirectionDiagonally(isWhite, row, col, true, false);
  //     const bottomLeft = this.checkDirectionDiagonally(isWhite, row, col, false, false);
  //     return left || right || top || bottom || topRight || topLeft || bottomRight || bottomLeft;
  //   }
  //   return false;
  // }
  // private checkDirection(isWhite: boolean, row: number, col: number, horizontal: boolean, right: boolean = false, top: boolean = false): boolean {
  //   let offset = 0;
  //   if(horizontal) {
  //     offset = right ? 1 : -1
  //   } else {
  //     offset = top ? -1 : 1;
  //   }
  //   while(row >= 1 && row <= 8 && col >= 1 && col <= 8) {
  //     if(horizontal) {
  //       row += offset;
  //     } else {
  //       col += offset;
  //     }
  //     const foundSquare = this.findSquare(row, col);
  //     if(foundSquare && foundSquare.occupiedBy != null) {
  //       const isEnemy = foundSquare.occupiedBy.isWhite !== isWhite;
  //       return isEnemy && (foundSquare.occupiedBy instanceof Queen || foundSquare.occupiedBy instanceof Rook);
  //     }
  //   }
  //   return false;
  // }
  // private checkDirectionDiagonally(isWhite: boolean, row: number, col: number, right: boolean, top: boolean): boolean {
  //   const offsetCol = right ? 1 : -1;
  //   const offsetRow = top ? -1 : 1;
  //   while(row >= 1 && row <= 8 && col >= 1 && col <= 8) {
  //     row += offsetRow;
  //     col += offsetCol;
  //     const foundSquare = this.findSquare(row, col);
  //     if(foundSquare && foundSquare.occupiedBy != null) {
  //       const isEnemy = foundSquare.occupiedBy.isWhite !== isWhite;
  //       return isEnemy && (foundSquare.occupiedBy instanceof Queen || foundSquare.occupiedBy instanceof Bishop);
  //     }
  //   }
  //   return false;
  // }
  private findSquare(row: number, col: number): Square | undefined {
    return this.squares.find(square => square.position.row === row && square.position.column === col);
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
