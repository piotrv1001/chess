import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';

export class Pawn extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = '/src/assets/images/white-pawn.png';
    } else {
      this.imgUrl = '/src/assets/images/black-pawn.png';
    }
  }
  checkLegalMoves(): Position[] {
    const moves: Position[] = [];
    const upperLimit = (this.isWhite) ? 7 : 2;
    const multiplier = (this.isWhite) ? -1 : 1;
    if(this.currentPosition.row === upperLimit) {
      moves.push(
        { row: this.currentPosition.row + 1 * multiplier, column: this.currentPosition.column },
        { row: this.currentPosition.row + 2 * multiplier, column: this.currentPosition.column }
      );
    } else if(this.currentPosition.row > 1 && this.currentPosition.row < 8) {
      moves.push(
        { row: this.currentPosition.row + 1 * multiplier, column: this.currentPosition.column }
      );
    }
    // TODO: promotion case
    return moves;
  }
}
