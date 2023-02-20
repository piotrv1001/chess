import { Position, ChessEntity } from './chess-entity';

export class Square {
  constructor(
    public position: Position,
    public occupiedBy?: ChessEntity | null
  ) {}
}
