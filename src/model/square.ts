import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';

export class Square {
  constructor (
    public position: Position,
    public isWhite: boolean,
    public occupiedBy?: ChessEntity | null
  ) {}
}
