import { delay, tap } from 'rxjs';
import { SHIP_SIZES } from '../constants/ships.constants';
import { ComputerPlayer, UserPlayer } from './player.model';

export class Battleship {
  user: UserPlayer;
  computer: ComputerPlayer;

  constructor(
    dimentions = 10,
    shipSizes = SHIP_SIZES,
    ) {
    this.user = new UserPlayer(dimentions, shipSizes, true);
    this.computer = new ComputerPlayer(dimentions, shipSizes, false);

    this.user.play
      .pipe(
        tap(data => this.computer.updateBoard(data.coordinate, data.shipId)),
      )
      .subscribe();

    this.computer.play
      .pipe(
        tap(data => this.user.updateBoard(data.coordinate, data.shipId)),
      )
      .subscribe();

    this.user.afterUpdateBoard
      .pipe(
        tap(() => this.computer.setTurn(false)),
        tap(() => this.user.setTurn(true)),
      )
      .subscribe();

    this.computer.afterUpdateBoard
      .pipe(
        tap(() => this.user.setTurn(false)),
        tap(() => this.computer.setTurn(true)),
        delay(200),
        tap(() => this.computer.askOpponent(this.user.board)),
      )
      .subscribe();
  }

}
