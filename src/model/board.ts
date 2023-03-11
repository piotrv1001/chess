import { EnPassant } from './en-passant';
import { Castles } from './castles';
import { GameResult } from './../app/types/game-result';
import { Move } from './move';
import { Pawn } from './pawn';
import { King } from './king';
import { Queen } from './queen';
import { Bishop } from './bishop';
import { Knight } from './knight';
import { Rook } from './rook';
import { Square } from './square';
import { Position } from 'src/app/types/position';
import { Pinned } from 'src/app/types/pinned';

export class Board {
  squares: Square[];
  lastMove?: Move;
  legalMoves: Map<Square, Move[]> = new Map();
  enemyMoves: Map<Square, Move[]> = new Map();
  isCheckMate: boolean = false;
  gameResult: GameResult = GameResult.IN_PROGRESS;
  pathToCheck: Square[] = []; // if we are in check we have to know the path to check, so every piece can only move onto that path to block the check
  pinned: Pinned[] = []; // pinned pieces that can only move in the line of pin
  constructor() {
    this.squares = this.initSquares();
    this.checkIfCheckmate(true);
  }
  checkPawnPromotion(): boolean {
    const isWhite = this.lastMove?.piece.isWhite ?? false;
    if(this.lastMove?.piece instanceof Pawn) {
      const lastRow = this.lastMove.endingPos.position.row
      return (isWhite && lastRow === 1) || (!isWhite && lastRow === 8)
    }
    return false
  }
  checkIfCheckmate(isWhite: boolean): boolean {
    this.calculateLegalMoves(isWhite);
    for(const [, moves] of this.legalMoves) {
      if(moves.length > 0) {
        return false;
      }
    }
    return true;
  }
  private calculateLegalMoves(isWhite: boolean): void {
    for(const square of this.squares) {
      if(square.occupiedBy == null) continue;
      else if(square.occupiedBy.isWhite !== isWhite) {
        const moves = square.occupiedBy.checkLegalMoves(this, true);
        this.enemyMoves?.set(square, moves);
      }
    }
    for(const square of this.squares) {
      if(square.occupiedBy == null) continue;
      if(square.occupiedBy.isWhite === isWhite) {
        let moves = square.occupiedBy.checkLegalMoves(this);
        // if King -> he can move out of the way, otherwise -> block the check
        if(this.pathToCheck.length > 0 && !(square.occupiedBy instanceof King)) {
          moves = moves.filter(move => this.pathToCheck.includes(move.endingPos));
        }
        // prevent King from walking into a check
        if(square.occupiedBy instanceof King) {
          moves = moves.filter(move => {
            for(const [, enemyMoves] of this.enemyMoves) {
              const enemyEndingPosArray = enemyMoves.map(enemyMove => enemyMove.endingPos);
              if(enemyEndingPosArray.includes(move.endingPos)) {
                return false;
              } if(move instanceof Castles) {
                let middleSquare: Square | undefined;
                const row = move.endingPos.position.row
                let col = 0;
                if(move.isLong) {
                  col = move.endingPos.position.column + 1;
                  middleSquare = this.squares.find(square => square.position.row === row && square.position.column === col);
                } else {
                  col = move.endingPos.position.column - 1;
                  middleSquare = this.squares.find(square => square.position.row === row && square.position.column === col);
                }
                const kingCurrentSquare = move.startingPos;
                if(middleSquare) {
                  if(enemyEndingPosArray.includes(middleSquare)) {
                    return false;
                  }
                }
                if(kingCurrentSquare) {
                  if(enemyEndingPosArray.includes(kingCurrentSquare)) {
                    return false;
                  }
                }
              }
            }
            return true;
          });
        }
        // handle pinned pieces
        const pinnedPieceArray = this.pinned.map(pinned => pinned.pinnedPiece);
        const pinnedPieceIndex = pinnedPieceArray.indexOf(square.occupiedBy);
        if(pinnedPieceIndex !== -1) {
          const pinnedPath = this.pinned[pinnedPieceIndex].pinnedPath;
          moves = moves.filter(move => pinnedPath.includes(move.endingPos));
        }
        this.legalMoves?.set(square, moves);
      }
    }
  }
  makeMove(move: Move): void {
    const startingPos = this.squares.find(square => square.position === move.startingPos.position);
    const endingPos = this.squares.find(square => square.position === move.endingPos.position);
    if(startingPos && endingPos) {
      move.piece.hasAlreadyMoved = true;
      if(move.piece instanceof Pawn) {
        move.piece.moveCounter++;
      }
      startingPos.occupiedBy = null;
      endingPos.occupiedBy = move.piece;
      this.lastMove = move;
      if(this.lastMove instanceof Castles) {
        let rookSquare: Square | undefined;
        let rookDestination: Square | undefined;
        const row = this.lastMove?.endingPos.position.row;
        let col = 0;
        if(this.lastMove.isLong) {
          col = this.lastMove.endingPos.position.column + 1;
          rookSquare = this.squares.find(square => square.position.row === row && square.position.column === 1);
          rookDestination = this.squares.find(square => square.position.row === row && square.position.column === col);
        } else {
          col = this.lastMove.endingPos.position.column - 1;
          rookSquare = this.squares.find(square => square.position.row === row && square.position.column === 8);
          rookDestination = this.squares.find(square => square.position.row === row && square.position.column === col);
        }
        if(rookSquare && rookDestination) {
          const rook = rookSquare.occupiedBy;
          rookDestination.occupiedBy = rook;
          rookSquare.occupiedBy = null;
        }
      } else if(move instanceof EnPassant) {
        const multiplier = (move.piece.isWhite) ? 1 : -1;
        const squareBefore = this.squares.find(square => square.position.row === move.endingPos.position.row + 1 * multiplier && square.position.column === move.endingPos.position.column);
        if(squareBefore) {
          squareBefore.occupiedBy = null;
        }
      }
    }
    this.pinned = [];
    this.pathToCheck = [];
    this.legalMoves.clear();
    this.enemyMoves.clear();
    const isWhite = !move.piece.isWhite;
    this.isCheckMate = this.checkIfCheckmate(isWhite);
    if(this.isCheckMate) {
      if(!this.isKingInCheck()) {
        this.gameResult = GameResult.DRAW;
      } else {
        if(isWhite) {
          this.gameResult = GameResult.BLACK_WON;
        } else {
          this.gameResult = GameResult.WHITE_WON;
        }
      }
    }
  }
  isKingInCheck(): boolean {
    const isWhite = !this.lastMove?.piece.isWhite;
    const kingSquare = this.squares.find(square => square.occupiedBy instanceof King && square.occupiedBy.isWhite === isWhite);
    if(kingSquare) {
      for(const [, moves] of this.enemyMoves) {
        if(moves.map(move => move.endingPos).includes(kingSquare)) {
          return true;
        }
      }
      return false;
    }
    return false;
  }
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
