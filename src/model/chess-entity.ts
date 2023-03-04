import { Position } from "src/app/types/position";

export interface IChessEntity {
  isWhite: boolean;
  currentPosition: Position;
  imgUrl?: string;
  checkLegalMoves?(): Position[];
  makeMove(square: Position): void;
}

export class ChessEntity implements IChessEntity {
  constructor (
    public isWhite: boolean,
    public currentPosition: Position,
    public imgUrl?: string
  ) {}
  makeMove(square: Position): void {
    this.currentPosition = square;
  }
}
