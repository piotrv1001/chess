import { Square } from './square';

export class Board {
  squares: Square[];
  constructor() {
    this.squares = this.initSquares();
  }
  private initSquares(): Square[] {
    return [];
  }
}
