import { Move } from './../../model/move';
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Square } from "src/model/square";

@Injectable({
  providedIn: 'root'
})
export class SquareService {

  private squareClickSubject: Subject<Square> = new Subject<Square>();
  private legalMoveSubject: Subject<Move[]> = new Subject<Move[]>();
  private lastMoveSubject: Subject<Move> = new Subject<Move>();

  getSquareClickObservable(): Observable<Square> {
    return this.squareClickSubject.asObservable();
  }

  getLegalMoveObservable(): Observable<Move[]> {
    return this.legalMoveSubject.asObservable();
  }

  getLastMoveObservable(): Observable<Move> {
    return this.lastMoveSubject.asObservable();
  }

  notifyAllSquares(square: Square): void {
    this.squareClickSubject.next(square);
  }

  notifyAboutLegalMoves(moves: Move[]): void {
    this.legalMoveSubject.next(moves);
  }

  notifyAboutLastMove(move: Move): void {
    this.lastMoveSubject.next(move);
  }

}
