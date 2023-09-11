import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Battleship, GameOverInfo } from '../../models/battleship.model';
import { BoardComponent } from '../../components/board/board.component';
import { SHIP_SIZES } from '../../constants/ships.constants';
import { AttackLogComponent } from '../../components/attack-log/attack-log.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { take, tap } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { HistoryService } from '../../services/history.service';

@Component({
  standalone: true,
  imports: [CommonModule, BoardComponent, AttackLogComponent, DialogComponent],
  templateUrl: './board.view.html',
  styleUrls: ['./board.view.scss'],
})
export default class BoardView {
  battleship!: Battleship;
  gameOverInfo?: GameOverInfo;

  constructor(
    private configService: ConfigService,
    private historyService: HistoryService
  ) {
    this.initialize();
  }

  initialize() {
    this.gameOverInfo = undefined;
    this.battleship = new Battleship(
      10,
      SHIP_SIZES,
      this.configService.getSetupTurns()
    );
    this.battleship.gameOver
      .pipe(
        take(1),
        tap(([player, result]) => this.historyService.saveHistory(this.battleship, player, result)),
        tap(
          ([player, result]) =>
            (this.gameOverInfo = this.battleship.getGameOverInfo(
              player,
              result
            ))
        )
      )
      .subscribe();
  }
}
