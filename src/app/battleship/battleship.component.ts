import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-battleship',
  standalone: true,
  imports: [CommonModule, BoardComponent],
  templateUrl: './battleship.component.html',
  styleUrls: ['./battleship.component.scss']
})
export default class BattleshipComponent {



}
