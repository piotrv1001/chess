import { Board } from './board';
import { Square } from './square';
import { Move } from './move';
import { Position } from "src/app/types/position";
import { cloneDeep } from 'lodash';

export interface IChessEntity {
  isWhite: boolean;
  currentPosition: Position;
  imgUrl?: string;
  checkLegalMoves(board: Board): Move[];
  makeMove(square: Position): void;
}

export class ChessEntity implements IChessEntity {
  constructor (
    public isWhite: boolean,
    public currentPosition: Position,
    public imgUrl?: string
  ) {}
  checkLegalMoves(board: Board, enemyMoves: boolean = false): Move[] {
    return [];
  }
  makeMove(square: Position): void {
    this.currentPosition = square;
  }
}
