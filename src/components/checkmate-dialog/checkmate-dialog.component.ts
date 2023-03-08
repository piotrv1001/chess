import { GameResult } from './../../app/types/game-result';
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-checkmate-dialog',
  templateUrl: './checkmate-dialog.component.html'
})
export class CheckmateDialog {
  message?: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { gameResult: GameResult }) {
    switch(data.gameResult) {
      case GameResult.DRAW:
        this.message = "It's a draw";
        break;
      case GameResult.WHITE_WON:
        this.message = 'White won!';
        break;
      case GameResult.BLACK_WON:
        this.message = 'Black won!';
        break;
    }
  }
}
