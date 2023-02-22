import { Position, ChessEntity } from './chess-entity';

export class Queen extends ChessEntity {
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
    let row = this.currentPosition.row;
    let col = this.currentPosition.column;
    while(row < 8 && col < 8) {
      row++;
      col++;
      moves.push(
        { row: row, column: col }
      );
    }
    row = this.currentPosition.row;
    col = this.currentPosition.column;
    while(row < 8 && col > 1) {
      row++;
      col--;
      moves.push(
        { row: row, column: col }
      );
    }
    row = this.currentPosition.row;
    col = this.currentPosition.column;
    while(row > 8 && col < 8) {
      row--;
      col++;
      moves.push(
        { row: row, column: col }
      );
    }
    row = this.currentPosition.row;
    col = this.currentPosition.column;
    while(row > 1 && col > 1) {
      row--;
      col--;
      moves.push(
        { row: row, column: col }
      );
    }

    return moves;
  }
}
