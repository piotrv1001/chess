import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';

export class Bishop extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = '/assets/images/white-bishop.png';
    } else {
      this.imgUrl = '/assets/images/black-bishop.png';
    }
  }
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
