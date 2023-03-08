import { ChessEntity } from './../../model/chess-entity';
import { Square } from "src/model/square"

export type Pinned  = {
  pinnedPath: Square[],
  pinnedPiece: ChessEntity
}
