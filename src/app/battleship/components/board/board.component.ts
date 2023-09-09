import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board, BoardCell } from '../../models/board.model';
import { TruthyKeysToStringPipe } from 'src/app/pipes/truthy-keys-to-string.pipe';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, TruthyKeysToStringPipe],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() showShips = false;
  @Input() disabled = false;
  @Input({ required: true }) board!: Board;
  @Output() attack: EventEmitter<BoardCell> = new EventEmitter()

  cells: BoardCell[] = [];

  constructor(private elementRef: ElementRef, private render: Renderer2) {}

  ngOnInit(): void {
    this.render.setStyle(this.elementRef.nativeElement, 'grid-template-columns', `repeat(${this.board.internalDimention}, 1fr)`)
    this.cells = Array.from(this.board.cells.values());

  }
}
