import { Position, ChessEntity } from './chess-entity';

export class King extends ChessEntity {
  checkLegalMoves(): Position[] {
    const moves: Position[] = []
    for(let i = this.currentPosition.row - 1; i <= this.currentPosition.row + 1; i++) {
      if(i >= 8 || i <= 1) break;
      for(let j = this.currentPosition.column - 1; j <= this.currentPosition.column + 1; j++) {
        if(j >= 8 || j <= 1) break;
        moves.push({ row: i, column: j });
      }
    }
    return moves;
  }

}
