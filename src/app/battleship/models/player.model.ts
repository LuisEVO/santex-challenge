import { randomBoolean } from 'src/app/utils/random-boolean';
import { Board, BoardCell } from './board.model';
import { Ship } from './ship.model';
import { Subject } from 'rxjs';
import { AttackRecord, AttackResult } from './attack.model';

export type PlayerType = 'user' | 'computer';
export abstract class Player {
  abstract type: PlayerType;
  board!: Board;
  ships: Ship[] = [];
  attacks: AttackRecord[] = [];

  constructor(
    private dimentions: number,
    private shipSizes: number[],
    public maxTurns: number,
  ) {
    this.setBoard();
    this.organizeShips();
  }

  setBoard() {
    this.board = new Board(this.dimentions);
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

  canAttackCell(cell: BoardCell) {
    return (this.board.canTouchCell(cell.coordinate));
  }

  setAttackOnBoard(cell: BoardCell) {
    this.board.touchCell(cell.coordinate);

    let result: AttackResult = 'failed';

    if (cell.ship) {
      const ship = this.ships.find((ship) => ship.id === cell.ship?.id)!;
      const coordinate = ship.coordinates.find(
        (coordinate) => coordinate.code === cell.coordinate
      )!;

      coordinate.isImpacted = true;
      result = ship.isDestroyed ? 'destroyed' : 'impacted';

      this.board.updateShipStatus(cell.coordinate, {
        status: result,
        coordinates: ship.coordinates.map((coordinate) => coordinate.code),
      });
    }

    return new AttackRecord(cell.coordinate, result);
  }

  trackAttack(attack: AttackRecord) {
    this.attacks.unshift(attack);
  }

  checkIfGameFinish(): 'win' | 'lost' | undefined {
    if (this.ships.every(ship => ship.isDestroyed)) {
      return 'win'
    } else if (this.attacks.length === this.maxTurns) {
      return 'lost'
    }

    return;
  }
}

export class UserPlayer extends Player {
  type: PlayerType = 'user';
}

export class ComputerPlayer extends Player {
  type: PlayerType = 'computer';

  selectCellToAttack(board: Board): BoardCell {
    // TODO: improve so code looks for coordinates next to impacted cells
    const row = Math.floor(Math.random() * 10) + 1;
    const col = Math.floor(Math.random() * 10) + 1;
    const coordinate = `${row}:${col}`;
    const cell = board.cells.get(coordinate)!;
    if (cell.isTouched) return this.selectCellToAttack(board);
    return cell;
  }
}
