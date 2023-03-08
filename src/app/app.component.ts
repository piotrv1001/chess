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
  moveHistory: Move[] = [];
  legalMoves: Move[] = [];

  constructor(
    private squareService: SquareService,
    public dialog: MatDialog) {
    this.board = new Board();
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

  private showLegalMoves(square: Square): void {
    this.legalMoves = this.board.legalMoves.get(square) ?? [];
    this.notifyLegalMoves();
  }

  private makeMove(move: Move): void {
    this.board.makeMove(move);
    this.moveHistory.push(move);
    this.isWhiteMove = !this.isWhiteMove;
    this.legalMoves = [];
    this.notifyLegalMoves();
  }

  private notifyLegalMoves(): void {
    this.squareService.notifyAboutLegalMoves(this.legalMoves);
  }

  private openCheckmateDialog(): void {
    this.dialog.open(CheckmateDialog);
  }
}
