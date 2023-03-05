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

  constructor(private squareService: SquareService) {
    this.board = new Board();
  }

  ngOnInit(): void {
  }

  onSquareClick(square: Square): void {
    this.squareService.notifyAllSquares(square);
    this.showLegalMoves();
  }

  private showLegalMoves(): void {
    const legalMoves: Square[] = [];
    legalMoves.push(this.board.squares[36]);
    legalMoves.push(this.board.squares[44]);
    this.squareService.notifyAboutLegalMoves(legalMoves);
  }
}
