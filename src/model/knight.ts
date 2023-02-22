import { Position, ChessEntity } from './chess-entity';

export class Knight extends ChessEntity {
  checkLegalMoves(): Position[] {
    const row = this.currentPosition.row;
    const col = this.currentPosition.column;
    return this.addToMoves(
      { row: row + 1, column: col - 2 },
      { row: row + 1, column: col + 2 },
      { row: row + 2, column: col - 1 },
      { row: row + 2, column: col + 1 },
      { row: row - 1, column: col + 2 },
      { row: row - 1, column: col - 2 },
      { row: row - 2, column: col - 1 },
      { row: row - 2, column: col + 1 },
    );
  }
  private checkBounds(row: number, column: number): boolean {
    return row >= 1 && row <= 8 && column >= 1 && column <= 8;
  }
  private addToMoves(...positions: Position[]): Position[] {
    const moves: Position[] = [];
    for(const pos of positions) {
      if(this.checkBounds(pos.row, pos.column)) {
        moves.push(
          { row: pos.row, column: pos.column }
        );
      }
    }
    return moves;
  }
}
