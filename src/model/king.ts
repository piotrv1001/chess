import { Castles } from './castles';
import { Rook } from './rook';
import { Board } from './board';
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
  override checkLegalMoves(board: Board): Move[] {
    const squares = board.squares;
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
      if(currSquare.occupiedBy && !this.hasAlreadyMoved) {
        // check for castles
        const row = currPos.row;
        let col = currPos.column;
        while(col <= 8) {
          col++;
          const foundSquare = squares.find(square => square.position.row === row && square.position.column === col);
          const sameTeam = (foundSquare?.occupiedBy?.isWhite === currSquare.occupiedBy?.isWhite);
          const occupiedBy = foundSquare?.occupiedBy;
          if(foundSquare) {
            if(occupiedBy instanceof Rook && sameTeam && !occupiedBy.hasAlreadyMoved) {
              const kingDestination = squares.find(square => square.position.row === row && square.position.column === col - 1);
              if(kingDestination) {
                const move = new Castles(currSquare, kingDestination, currSquare.occupiedBy, false);
                moves.push(move);
              }
            } else if(foundSquare.occupiedBy != null) {
              break;
            }
          }
        }
        col = currPos.column;
        while(col >= 1) {
          col--;
          const foundSquare = squares.find(square => square.position.row === row && square.position.column === col);
          const sameTeam = (foundSquare?.occupiedBy?.isWhite === currSquare.occupiedBy?.isWhite);
          const occupiedBy = foundSquare?.occupiedBy;
          if(foundSquare) {
            if(occupiedBy instanceof Rook && sameTeam && !occupiedBy.hasAlreadyMoved) {
              const kingDestination = squares.find(square => square.position.row === row && square.position.column === col + 2);
              if(kingDestination) {
                const move = new Castles(currSquare, kingDestination, currSquare.occupiedBy, true);
                moves.push(move);
              }
            } else if(foundSquare.occupiedBy != null) {
              break;
            }
          }
        }
      }
    }
    return moves;
  }

}
