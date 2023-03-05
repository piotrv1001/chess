import { Move } from './../model/move';
import { SquareService } from './services/square.service';
import { Board } from './../model/board';
import { Component, OnInit } from '@angular/core';
import { Square } from 'src/model/square';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  board: Board;
  isWhiteMove: boolean = true;
  moveHistory: Move[] = [];
  legalMoves: Move[] = [];

  constructor(private squareService: SquareService) {
    this.board = new Board();
  }

  ngOnInit(): void {
  }

  onSquareClick(square: Square): void {
    this.squareService.notifyAllSquares(square);
    const foundMove = this.legalMoves.find(move => move.endingPos === square);
    if(foundMove) {
      this.makeMove(foundMove);
    }
    // if white turn and piece is white (and vice versa) -> show legal moves
    else if(square.occupiedBy?.isWhite === this.isWhiteMove) {
      this.showLegalMoves(square);
    }
  }

  private showLegalMoves(square: Square): void {
    this.legalMoves = square.occupiedBy?.checkLegalMoves(this.board.squares) ?? [];
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
}
