import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';

export class Rook extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = '/assets/images/white-rook.png';
    } else {
      this.imgUrl = '/assets/images/black-rook.png';
    }
  }
  checkLegalMoves(): Position[] {
    const moves: Position[] = [];
    let rowLeft = this.currentPosition.row;
    let rowRight = this.currentPosition.row;
    let colTop = this.currentPosition.column;
    let colBottom = this.currentPosition.column;
    while(rowLeft >= 1) {
      moves.push(
        { row: rowLeft, column: this.currentPosition.column }
      );
      rowLeft--;
    }
    while(rowRight <= 8) {
      moves.push(
        { row: rowRight, column: this.currentPosition.column }
      );
      rowLeft++;
    }
    while(colTop >= 1) {
      moves.push(
        { row: this.currentPosition.row, column: colTop }
      );
      colTop--;
    }
    while(colBottom <= 8) {
      moves.push(
        { row: this.currentPosition.row, column: colBottom }
      );
      colBottom++;
    }
    return moves;
  }
}
