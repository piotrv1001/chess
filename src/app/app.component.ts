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
    } else {
      this.showLegalMoves(square);
    }
  }

  private showLegalMoves(square: Square): void {
    const startingPos = this.board.squares[52];
    const endingPos1 = this.board.squares[1];
    const endingPos2 = this.board.squares[44];
    const piece = this.board.squares[52].occupiedBy;
    this.legalMoves.push(new Move(startingPos, endingPos1, piece!));
    this.legalMoves.push(new Move(startingPos, endingPos2, piece!));
    this.squareService.notifyAboutLegalMoves(this.legalMoves);
  }

  private makeMove(move: Move): void {
    this.board.makeMove(move);
    this.moveHistory.push(move);
    this.isWhiteMove = !this.isWhiteMove;
  }
}
