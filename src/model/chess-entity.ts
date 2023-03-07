import { Board } from './board';
import { Square } from './square';
import { Move } from './move';
import { Position } from "src/app/types/position";
import { cloneDeep } from 'lodash';

export interface IChessEntity {
  isWhite: boolean;
  currentPosition: Position;
  imgUrl?: string;
  checkLegalMoves(squares: Square[]): Move[];
  makeMove(square: Position): void;
  checkIfMoveIsLegal(move: Move, board: Board): boolean;
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
  checkIfMoveIsLegal(move: Move, board: Board): boolean {
    const boardCopy = cloneDeep(board);
    boardCopy.makeMove(move);
    return boardCopy.isKingInCheck();
  }
}
