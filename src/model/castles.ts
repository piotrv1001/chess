import { Move } from 'src/model/move';
import { ChessEntity } from './chess-entity';
import { Square } from './square';

export class Castles extends Move {
  isLong: boolean;
  constructor(
    startingPos: Square,
    endingPos: Square,
    piece: ChessEntity,
    isLong: boolean
  ) {
    super(startingPos, endingPos, piece);
    this.isLong = isLong;
  }
}
