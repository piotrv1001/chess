import { Position, ChessEntity } from './chess-entity';

export class Bishop extends ChessEntity {
  checkLegalMoves(): Position[] {
    const moves: Position[] = [];
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
