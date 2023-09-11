import { Subject, map, of, takeUntil } from 'rxjs';
import { ComputerPlayer, Player, UserPlayer } from './player.model';
import { BoardCell } from './board.model';
export class Battleship {
  user: UserPlayer;
  computer: ComputerPlayer;
  gameOver: Subject<boolean> = new Subject();
  // AAA: Subject<[Player, Player, BoardCell]> = new Subject();

  constructor(
    dimentions: number,
    shipSizes: number[],
    maxTurns: number = dimentions ** 2
  ) {
    this.user = new UserPlayer(dimentions, shipSizes, maxTurns, true);
    this.computer = new ComputerPlayer(dimentions, shipSizes, maxTurns, false);

    this.user.onAttack.subscribe((cell) => {
      this.computer.setAttackOnBoard(cell);
    });

    this.computer.onAttack.subscribe((cell) =>
      this.user.setAttackOnBoard(cell)
    );

    this.user.afterSetAttackOnBoard
      .pipe(takeUntil(this.gameOver))
      .subscribe((attackRecord) => {
        this.computer.trackAttack(attackRecord);
        this.computer.checkIfGameFinish();

        this.computer.setTurn(false);
        this.user.setTurn(true);
      });

    this.computer.afterSetAttackOnBoard
      .pipe(takeUntil(this.gameOver))
      .subscribe((attackRecord) => {
        this.user.trackAttack(attackRecord);
        this.user.checkIfGameFinish();

        this.user.setTurn(false);
        this.computer.setTurn(true);
        this.computer.attack(this.computer.selectCellToAttack(this.user.board));
      });

    this.user.onFinish.subscribe((res) => {
      console.log(`USER`, res);
      this.gameOver.next(true);
    });
    this.computer.onFinish.subscribe((res) => {
      console.log(`COMPUTER`, res);
      this.gameOver.next(true);
    });
  }
}
