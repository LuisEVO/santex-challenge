import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-battleship',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './battleship.layout.html',
  styleUrls: ['./battleship.layout.scss']
})
export default class BattleshipLayout {
}
