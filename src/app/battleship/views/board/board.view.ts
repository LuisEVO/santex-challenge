import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Battleship } from '../../models/battleship.model';
import { BoardComponent } from '../../components/board/board.component';
import { SHIP_SIZES } from '../../constants/ships.constants';
import { NotificationsComponent } from '../../components/notifications/notifications.component';

@Component({
  standalone: true,
  imports: [CommonModule, BoardComponent, NotificationsComponent],
  templateUrl: './board.view.html',
  styleUrls: ['./board.view.scss'],
})
export default class BoardView {
  battleship: Battleship;

  constructor() {
    this.battleship = new Battleship(10, SHIP_SIZES);
  }
}
