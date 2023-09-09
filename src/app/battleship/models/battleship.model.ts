import { Subject } from 'rxjs';
import { ComputerPlayer, UserPlayer } from './player.model';
export class Battleship {
  user: UserPlayer;
  computer: ComputerPlayer;

  constructor(dimentions: number, shipSizes: number[]) {
    this.user = new UserPlayer(dimentions, shipSizes, true);
    this.computer = new ComputerPlayer(dimentions, shipSizes, false);

    this.user.onAttack.subscribe((cell) => this.computer.updateBoard(cell));

    this.computer.onAttack.subscribe((cell) => this.user.updateBoard(cell));

    this.user.afterUpdateBoard.subscribe(() => {
      this.computer.setTurn(false);
      this.user.setTurn(true);
    });

    this.computer.afterUpdateBoard.subscribe(() => {
      this.user.setTurn(false);
      this.computer.setTurn(true);
      this.computer.attack(this.user.board);
    });
  }
}
