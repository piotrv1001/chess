import { Board } from './../model/board';
import { Component, OnInit } from '@angular/core';

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
}
