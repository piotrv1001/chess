export type Position = {
  row: number;
  column: number
}

export interface IChessEntity {
  name: string;
  imgUrl: string;
  isWhite: boolean;
  currentPosition: Position;
  checkLegalMoves?(): Position[];
  makeMove(square: Position): void;
}

export class ChessEntity implements IChessEntity {
  constructor(
    public name: string,
    public imgUrl: string,
    public isWhite: boolean,
    public currentPosition: Position
  ) {}
  makeMove(square: Position): void {
    this.currentPosition = square;
  }
}
