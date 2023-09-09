import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board, BoardItem } from './board';
import { validateNumberToLetter } from 'src/app/utils/number-to-letter.util';
import { TruthyKeysToStringPipe } from 'src/app/pipes/truthy-keys-to-string.pipe';
import { SHIPS } from '../constants/ships.constants';

/**
 * This function validate dimention input
 * to use valid alphabetical letters in board
 * @param value number of rows and cols of board
 */
function validateDimention(value: number): number {
  validateNumberToLetter(value)
  return value;
};

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TruthyKeysToStringPipe],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  @Input({ required: true, transform: validateDimention }) dimention!: number;
  @Input() isOpponent = false;
  board?: Board;

  constructor(private elementRef: ElementRef, private render: Renderer2) {}

  ngOnInit(): void {
    this.board = new Board(this.dimention);
    this.board.addBulkShips(SHIPS.map(ship => ship.size))
    this.render.setStyle(this.elementRef.nativeElement, 'grid-template-columns', `repeat(${this.board.internalDimention}, 1fr)`)
  }

  /*
  cellHandler(col: BoardItem) {
    if (!this.isOpponent || !col.cell) return;
    col.cell.state = col.ship ? 'impact' : 'failed';
    console.log(col);
  }
  */

}
