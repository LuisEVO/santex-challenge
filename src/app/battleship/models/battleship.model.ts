import { Subject, map, take, takeUntil, tap } from 'rxjs';
import { ComputerPlayer, Player, UserPlayer } from './player.model';
import { BoardCell } from './board.model';

export type GameOverType = 'won' | 'lost';
export type GameOverInfo = {
  title: string,
  action?: string
};

export class Battleship {
  private playTurn: Subject<[Player, Player, BoardCell]> = new Subject();

  user: UserPlayer;
  computer: ComputerPlayer;
  gameOver = new Subject<[Player, GameOverType]>();

  start: Date;
  end?: Date;

  constructor(
    dimentions: number,
    shipSizes: number[],
    private maxTurns?: number
  ) {
    this.maxTurns = this.maxTurns ? this.maxTurns : dimentions ** 2
    this.user = new UserPlayer(dimentions, shipSizes, true, this.maxTurns);
    this.computer = new ComputerPlayer(dimentions, shipSizes, false, this.maxTurns);
    this.start = new Date();

    this.playTurn
      .pipe(
        takeUntil(this.gameOver),
        map(([player, opponent, cell]) => {
          if (opponent.canAttackCell(cell)) {
            const attackRecord = opponent.setAttackOnBoard(cell);
            player.trackAttack(attackRecord);
            const hasTurns = player.hasTurns();
            const allShipsAreDestroyed = opponent.allShipsAreDestroyed();
            const result: GameOverType | undefined = allShipsAreDestroyed
              ? 'won'
              : !hasTurns
              ? 'lost'
              : undefined;
            if (result) {
              this.end = new Date();
              this.gameOver.next([player, result]);
            } else {
              player.toggleTurn();
              opponent.toggleTurn();
            }
          }
        })
      )
      .subscribe();

    this.computer.onHasActiveTurn
      .pipe(
        takeUntil(this.gameOver),
        map(() => this.computer.selectCellToAttack(this.user.board)),
        tap((cell) => this.playTurn.next([this.computer, this.user, cell]))
      )
      .subscribe();
  }

  playUser(cell: BoardCell) {
    this.playTurn.next([this.user, this.computer, cell]);
  }

  getGameOverInfo(player: Player, result: GameOverType): GameOverInfo {
    return {
      title: `${player.type === 'computer' ? 'Computer' : 'You'} ${
        result === 'won' ? 'Won' : 'Lost'
      }`,
      action: result === 'lost' ? 'Try Again' : undefined,
    }
  }
}
