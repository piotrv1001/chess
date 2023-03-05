import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';
import { Move } from './move';
import { Square } from './square';

export class King extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = 'assets/images/white-king.png';
    } else {
      this.imgUrl = '/assets/images/black-king.png';
    }
  }
  override checkLegalMoves(squares: Square[]): Move[] {
    const moves: Move[] = [];
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare) {
      const currPos = currSquare?.position;
      for(let i = currPos.row - 1; i <= currPos.row + 1; i++) {
        if(i > 8 || i < 1) continue;
        for(let j = currPos.column - 1; j <= currPos.column + 1; j++) {
          if(j > 8 || j < 1) continue;
          const foundSquare = squares.find(square => square.position.row === i && square.position.column === j);
          const occupiedByEnemy = (foundSquare?.occupiedBy?.isWhite !== currSquare.occupiedBy?.isWhite);
          if(foundSquare && (foundSquare.occupiedBy == null || occupiedByEnemy)) {
            if(currSquare.occupiedBy) {
              const move = new Move(currSquare, foundSquare, currSquare.occupiedBy);
              moves.push(move);
            }
          }
        }
      }
    }
    return moves;
  }

}
