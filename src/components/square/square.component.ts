import { Component, Input } from '@angular/core';
import { Position } from 'src/app/types/position';
import { ChessEntity } from './../../model/chess-entity';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() isWhite?: boolean;
  @Input() position?: Position;
  @Input() occupiedBy?: ChessEntity | null;
}
