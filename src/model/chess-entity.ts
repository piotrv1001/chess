import { Square } from './square';
import { Move } from './move';
import { Position } from "src/app/types/position";

export interface IChessEntity {
  isWhite: boolean;
  currentPosition: Position;
  imgUrl?: string;
  checkLegalMoves(squares: Square[]): Move[];
  makeMove(square: Position): void;
}

export class ChessEntity implements IChessEntity {
  constructor (
    public isWhite: boolean,
    public currentPosition: Position,
    public imgUrl?: string
  ) {}
  checkLegalMoves(squares: Square[]): Move[] {
    return [];
  }
  makeMove(square: Position): void {
    this.currentPosition = square;
  }
}
