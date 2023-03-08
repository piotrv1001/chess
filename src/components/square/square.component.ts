import { SquareService } from './../../app/services/square.service';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit, OnInit, Renderer2 } from '@angular/core';
import { Square } from 'src/model/square';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() square?: Square;
  @ViewChild('squareRef') squareImgRef?: ElementRef;

  @Output() squareClick = new EventEmitter<Square>();

  isLegalMove: boolean = false;
  isCapture: boolean = false;
  private otherSquareClickSub?: Subscription;
  private legalMoveSub?: Subscription;
  private squareClickSub?: Subscription;
  private squareRightClickSub?: Subscription;
  private squareMouseOverSub?: Subscription;
  private squareMouseOutSub?: Subscription;

  constructor(
    private squareService: SquareService,
    private renderer: Renderer2) {
      // window.addEventListener("contextmenu", e => e.preventDefault());
    }

  get squareNative(): any {
    return this.squareImgRef?.nativeElement;
  }

  ngOnInit(): void {
    this.otherSquareClickSub = this.squareService.getSquareClickObservable()
      .subscribe(clickedSquare => {
        const classToRemove = (this.square?.isWhite) ? 'red-white-square' : 'red-dark-square';
        this.renderer.removeClass(this.squareNative, classToRemove);
        // check if we clicked on a different square
        if(this.square !== clickedSquare) {
          if(this.square?.occupiedBy != null) {
            const classToRemove = (this.square?.isWhite) ? 'clicked-white-square' : 'clicked-dark-square';
            this.renderer.removeClass(this.squareNative, classToRemove);
          }
        }
    });
    this.legalMoveSub = this.squareService.getLegalMoveObservable()
      .subscribe(legalMoves => {
        // check if this square is in the array of legal moves
        const foundMove = legalMoves.find(move => move.endingPos === this.square);
        if(foundMove) {
          this.isLegalMove = true;
          this.isCapture = foundMove.isCapture;
        } else {
          this.isLegalMove = false;
        }
      });
  }

  ngAfterViewInit(): void {
    if(this.squareNative) {
      const squareClick$ = fromEvent(this.squareNative, 'click');
      this.squareClickSub = squareClick$.subscribe(() => {
        if(this.square?.occupiedBy != null) {
          const classToAdd = (this.square?.isWhite) ? 'clicked-white-square' : 'clicked-dark-square';
          this.renderer.addClass(this.squareNative, classToAdd);
        }
        this.squareClick.emit(this.square);
      });
      const squareRickClick$ = fromEvent(this.squareNative, 'contextmenu');
      this.squareRightClickSub = squareRickClick$.subscribe((event: any) => {
        event.preventDefault();
        if(event.button === 2) {
          const classToToggle = (this.square?.isWhite) ? 'red-white-square' : 'red-dark-square';
          if(this.squareNative.classList.contains(classToToggle)) {
            this.renderer.removeClass(this.squareNative, classToToggle);
          } else {
            this.renderer.addClass(this.squareNative, classToToggle);
          }
        }
      });
      const squareMouseOver$ = fromEvent(this.squareNative, 'mouseover');
      this.squareMouseOverSub = squareMouseOver$.subscribe(() => {
        if(this.square?.occupiedBy != null) {
          document.body.style.cursor = 'pointer';
        }
      });
      const squareMouseOut$ = fromEvent(this.squareNative, 'mouseout');
      this.squareMouseOutSub = squareMouseOut$.subscribe(() => {
        if(this.square?.occupiedBy != null) {
          document.body.style.cursor = 'default';
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.removeSubs(
      this.squareClickSub,
      this.squareMouseOverSub,
      this.squareMouseOutSub,
      this.otherSquareClickSub,
      this.legalMoveSub,
      this.squareRightClickSub
    )
  }

  private removeSubs(...subs: (Subscription | undefined)[]): void {
    for(const sub of subs) {
      sub?.unsubscribe();
    }
  }

}
