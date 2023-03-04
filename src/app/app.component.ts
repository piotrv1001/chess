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

  constructor() {
    this.board = new Board();
  }

  ngOnInit(): void {
  }

  onSquareClick(square: Square): void {
    console.log('square', square);
  }
}
