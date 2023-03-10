import { Move } from './move';
import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';
import { Square } from './square';
import { Board } from './board';
import { King } from './king';

export class Knight extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = '/assets/images/white-knight.png';
    } else {
      this.imgUrl = '/assets/images/black-knight.png';
    }
  }
  override checkLegalMoves(board: Board, enemyMoves: boolean = false): Move[] {
    const squares = board.squares;
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare) {
      const currPos = currSquare.position;
      const row = currPos.row;
      const col = currPos.column;
       return this.addToMoves(
        currSquare, board, enemyMoves,
        { row: row + 1, column: col - 2 },
        { row: row + 1, column: col + 2 },
        { row: row + 2, column: col - 1 },
        { row: row + 2, column: col + 1 },
        { row: row - 1, column: col + 2 },
        { row: row - 1, column: col - 2 },
        { row: row - 2, column: col - 1 },
        { row: row - 2, column: col + 1 },
      );
    }
    return [];
  }
  private addToMoves(currSquare: Square, board: Board, enemyMoves: boolean, ...positions: Position[]): Move[] {
    const squares = board.squares;
    const moves: Move[] = [];
    for(const pos of positions) {
      if(this.checkBounds(pos.row, pos.column)) {
        const foundSquare = squares.find(square => square.position.row === pos.row && square.position.column === pos.column);
        if(foundSquare && foundSquare.occupiedBy?.isWhite !== currSquare.occupiedBy?.isWhite) {
          if(currSquare.occupiedBy) {
            const move = new Move(currSquare, foundSquare, currSquare.occupiedBy);
            moves.push(move);
            if(foundSquare.occupiedBy instanceof King) {
              board.pathToCheck.push(currSquare);
            }
          }
        }
      }
    }
    return moves;
  }
  private checkBounds(row: number, column: number): boolean {
    return row >= 1 && row <= 8 && column >= 1 && column <= 8;
  }
}
