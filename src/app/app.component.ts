import { cloneDeep } from 'lodash';
import { CheckmateDialog } from './../components/checkmate-dialog/checkmate-dialog.component';
import { Move } from './../model/move';
import { SquareService } from './services/square.service';
import { Board } from './../model/board';
import { Component } from '@angular/core';
import { Square } from 'src/model/square';

import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private squareService: SquareService,
    public dialog: MatDialog) {
    this.board = new Board();
    this.updateBoardVersionHistory();
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

  resetBoard(): void {
    this.board = new Board();
    this.isWhiteMove = true;
    this.boardVersionHistory = [];
    this.updateBoardVersionHistory();
  }

  goBack(): void {
    if(this.currentBoardVersion > 0) {
      this.currentBoardVersion--;
      this.board = this.boardVersionHistory[this.currentBoardVersion];
    }
  }

  goForward(): void {
    if(this.currentBoardVersion < this.boardVersionHistory.length - 1) {
      this.currentBoardVersion++;
      this.board = this.boardVersionHistory[this.currentBoardVersion];
    }
  }

  private showLegalMoves(square: Square): void {
    this.legalMoves = this.board.legalMoves.get(square) ?? [];
    this.notifyLegalMoves();
  }

  private makeMove(move: Move): void {
    this.board.makeMove(move);
    this.updateBoardVersionHistory();
    this.notifyLastMove(move);
    this.isWhiteMove = !this.isWhiteMove;
    this.legalMoves = [];
    this.notifyLegalMoves();
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
}
