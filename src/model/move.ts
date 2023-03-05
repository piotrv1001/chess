import { ChessEntity } from './chess-entity';
import { Square } from './square';

export class Move {
  isCapture: boolean;
  constructor (
    public startingPos: Square,
    public endingPos: Square,
    public piece: ChessEntity
  ) {
    this.isCapture = (endingPos.occupiedBy != null);
  }
}
