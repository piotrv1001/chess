import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Square } from "src/model/square";

@Injectable({
  providedIn: 'root'
})
export class SquareService {

  private squareClickSubject: Subject<Square> = new Subject<Square>();
  private legalMoveSubject: Subject<Square[]> = new Subject<Square[]>();

  getSquareClickObservable(): Observable<Square> {
    return this.squareClickSubject.asObservable();
  }

  getLegalMoveObservable(): Observable<Square[]> {
    return this.legalMoveSubject.asObservable();
  }

  notifyAllSquares(square: Square): void {
    this.squareClickSubject.next(square);
  }

  notifyAboutLegalMoves(squares: Square[]): void {
    this.legalMoveSubject.next(squares);
  }

}
