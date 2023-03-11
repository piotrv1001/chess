import { ChessEntity } from './../model/chess-entity';
import { Knight } from './../model/knight';
import { Bishop } from './../model/bishop';
import { PawnPromotionDialogComponent } from './../components/pawn-promotion-dialog/pawn-promotion-dialog.component';
import { cloneDeep  } from 'lodash';
import { CheckmateDialog } from './../components/checkmate-dialog/checkmate-dialog.component';
import { Move } from './../model/move';
import { SquareService } from './services/square.service';
import { Board } from './../model/board';
import { Component } from '@angular/core';
import { Square } from 'src/model/square';

import { MatDialog } from '@angular/material/dialog';
import { Piece } from './types/piece';
import { Queen } from 'src/model/queen';
import { Rook } from 'src/model/rook';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  board: Board;
  isWhiteMove: boolean = true;
  legalMoves: Move[] = [];
  boardVersionHistory: Board[] = [];
  currentBoardVersion = -1; // index in the boardVersionHistory array
  defaultOrientation: boolean = true;

  constructor(
    private squareService: SquareService,
    public dialog: MatDialog) {
    this.board = new Board();
    this.updateBoardVersionHistory();
  }

  get squares(): Square[] {
    return this.defaultOrientation ? this.board.squares : this.board.squares.reverse();
  }

  onSquareClick(square: Square): void {
    this.squareService.notifyAllSquares(square);
    const foundMove = this.legalMoves.find(move => move.endingPos === square);
    if(foundMove) {
      this.makeMove(foundMove);
      if(this.board.isCheckMate) {
        this.openCheckmateDialog();
      }
    }
    // if square not occupied or white turn and piece is white (and vice versa) -> show legal moves (empty array in case of unoccupied square)
    else if(square.occupiedBy == null || square.occupiedBy?.isWhite === this.isWhiteMove) {
      this.showLegalMoves(square);
    }
  }

  flipBoard(): void {
    this.defaultOrientation = !this.defaultOrientation;
  }

  resetBoard(): void {
    this.board = new Board();
    this.isWhiteMove = true;
    this.boardVersionHistory = [];
    this.updateBoardVersionHistory();
  }

  goBack(): void {
    if(this.currentBoardVersion > 0) {
      this.currentBoardVersion--;
      this.updateBoard();
    }
  }

  goForward(): void {
    if(this.currentBoardVersion < this.boardVersionHistory.length - 1) {
      this.currentBoardVersion++;
      this.updateBoard();
    }
  }

  private updateBoard(): void {
    this.board = this.boardVersionHistory[this.currentBoardVersion];
    setTimeout(() => {
      this.isWhiteMove = !this.isWhiteMove;
      this.board.calculateLegalMoves(this.isWhiteMove);
      const lastMove = this.board.lastMove;
      if(lastMove) {
        this.notifyLastMove(lastMove);
      }
    }, 0);
  }

  private showLegalMoves(square: Square): void {
    this.legalMoves = this.board.legalMoves.get(square) ?? [];
    this.notifyLegalMoves();
  }

  private makeMove(move: Move, flip: boolean = false): void {
    this.board.makeMove(move);
    this.updateBoardVersionHistory();
    this.notifyLastMove(move);
    if(!flip) {
      this.isWhiteMove = !this.isWhiteMove;
    }
    this.legalMoves = [];
    this.notifyLegalMoves();
    if(this.board.checkPawnPromotion()) {
      const isWhite = !this.isWhiteMove
      this.openPawnPromotionDialog(isWhite);
    }
  }

  private notifyLastMove(move: Move): void {
    this.squareService.notifyAboutLastMove(move);
  }

  private notifyLegalMoves(): void {
    this.squareService.notifyAboutLegalMoves(this.legalMoves);
  }

  private openCheckmateDialog(): void {
    this.dialog.open(CheckmateDialog, {
      data: { gameResult: this.board.gameResult }
    });
  }

  private updateBoardVersionHistory(): void {
    const boardClone = cloneDeep(this.board);
    this.boardVersionHistory.push(boardClone);
    this.currentBoardVersion++;
  }

  private openPawnPromotionDialog(isWhite: boolean): void {
    const dialogRef = this.dialog.open(PawnPromotionDialogComponent, {
      width: '30%',
      disableClose: true,
      data: { isWhite: isWhite }
    });
    dialogRef.afterClosed().subscribe((piece: Piece) => {
      const isWhite = this.board.lastMove?.piece.isWhite ?? false;
      const square = this.board.lastMove?.endingPos;
      const pos = square?.position;
      const startingPos = this.board.lastMove?.startingPos;
      let lastPiece: ChessEntity | null = null;
      if(square && pos && startingPos) {
        switch(piece) {
          case Piece.QUEEN:
            const queen = new Queen(isWhite, pos);
            square.occupiedBy = queen;
            lastPiece = queen;
            break;
          case Piece.ROOK:
            const rook = new Rook(isWhite, pos);
            square.occupiedBy = rook;
            lastPiece = rook;
            break;
          case Piece.BISHOP:
            const bishop = new Bishop(isWhite, pos);
            square.occupiedBy = bishop;
            lastPiece = bishop;
            break;
          case Piece.KNIGHT:
          const knight = new Knight(isWhite, pos);
          square.occupiedBy = knight;
          lastPiece = knight;
          break;
        }
        const newMove = new Move(startingPos, square, lastPiece);
        this.makeMove(newMove, true);
        if(this.board.isCheckMate) {
          this.openCheckmateDialog();
        }
      }
    });
  }
}
