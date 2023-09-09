import { randomBoolean } from 'src/app/utils/random-boolean';
import { Board, BoardCell } from './board.model';
import { Ship } from './ship.model';
import { Subject } from 'rxjs';

export type AttackStatus = 'failed' | 'impacted' | 'destroyed';

export const AttackStatusMap: Map<AttackStatus, string> = new Map([
  ['failed', 'Falló el ataque'],
  ['impacted', 'Dió en el barco'],
  ['destroyed', 'Destruyó el barco'],
])

export abstract class Player {
  board!: Board;
  ships: Ship[] = [];

  onAttack: Subject<BoardCell> = new Subject();
  afterUpdateBoard: Subject<void> = new Subject();
  notifications: Subject<string> = new Subject();

  abstract attack(params: any): void;

  constructor(
    private dimentions: number,
    private shipSizes: number[],
    public hasActiveTurn: boolean
  ) {
    this.setBoard();
    this.organizeShips();
  }

  setBoard() {
    this.board = new Board(this.dimentions)
  }

  updateBoard(cell: BoardCell) {
    if (!this.board.canTouchCell(cell.coordinate)) return;
    this.board.touchCell(cell.coordinate)

    let status: AttackStatus = 'failed';

    if (cell.ship) {
      const ship = this.ships.find((ship) => ship.id === cell.ship?.id)!;
      const coordinate = ship.coordinates.find(
        (coordinate) => coordinate.code === cell.coordinate
      )!;

      coordinate.isImpacted = true;
      status = ship.isDestroyed ? 'destroyed' : 'impacted';

      this.board.updateShipStatus(cell.coordinate, {
        status,
        coordinates: ship.coordinates.map(coordinate => coordinate.code)
      })
    }

    this.afterUpdateBoard.next();
    this.notifications.next(`${cell.displayCode} ${AttackStatusMap.get(status)!}`)
  }

  organizeShips() {
    this.ships = this.shipSizes.map((size) => {
      const ship = new Ship();
      const coordinates = this.board.addShip(ship.id, size, randomBoolean());
      ship.setCoordinates(coordinates);
      return ship;
    });
  }

  reorganizeShips() {
    this.board.cleanShips();
    this.organizeShips();
  }

  setTurn(turn: boolean) {
    this.hasActiveTurn = turn;
  }
}

export class UserPlayer extends Player {
  attack(cell: BoardCell) {
    if(!this.hasActiveTurn) return;
    this.onAttack.next(cell)
  }
}

export class ComputerPlayer extends Player {
  attack(board: Board): void {
    const row = Math.floor(Math.random() * 10) + 1
    const col = Math.floor(Math.random() * 10) + 1
    const coordinate = `${row}:${col}`;
    const cell = board.cells.get(coordinate)!
    if (cell.isTouched) return this.attack(board);
    this.onAttack.next(cell)
  }
}
