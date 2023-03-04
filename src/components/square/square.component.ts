import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Square } from 'src/model/square';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements AfterViewInit, OnDestroy {
  @Input() square?: Square;
  @ViewChild('squareRef') squareImgRef?: ElementRef;

  @Output() squareClick = new EventEmitter<Square>();

  private squareClickSub?: Subscription;

  ngAfterViewInit(): void {
    const squareNative = this.squareImgRef?.nativeElement;
    if(squareNative) {
      const squareClick$ = fromEvent(squareNative, 'click');
      this.squareClickSub = squareClick$.subscribe(() => {
        this.squareClick.emit(this.square);
      });
    }
  }

  ngOnDestroy(): void {
    if(this.squareClickSub) {
      this.squareClickSub.unsubscribe();
    }
  }

}
