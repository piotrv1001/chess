import { Board } from './board';
import { Move } from './move';
import { Position } from "src/app/types/position";

export interface IChessEntity {
  isWhite: boolean;
  currentPosition: Position;
  imgUrl?: string;
  hasAlreadyMoved?: boolean;
  checkLegalMoves(board: Board): Move[];
  makeMove(square: Position): void;
}

export class ChessEntity implements IChessEntity {
  constructor (
    public isWhite: boolean,
    public currentPosition: Position,
    public imgUrl?: string,
    public hasAlreadyMoved?: boolean
  ) {
    this.hasAlreadyMoved = false;
  }
  checkLegalMoves(board: Board, enemyMoves: boolean = false): Move[] {
    return [];
  }
  makeMove(square: Position): void {
    this.currentPosition = square;
  }
}
