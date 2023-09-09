import { randomBoolean } from 'src/app/utils/random-boolean';
import { Board, BoardCell } from './board.model';
import { Ship } from './ship.model';
import { Subject } from 'rxjs';

export abstract class Player {
  board!: Board;
  ships: Ship[] = [];

  play: Subject<{ coordinate: string, shipId?: string }> = new Subject();
  afterUpdateBoard: Subject<void> = new Subject();

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

  updateBoard(code: string, shipId?: string) {
    if (!this.board.canTouchCell(code)) return;
    this.board.touchCell(code)

    if (shipId) {
      const ship = this.ships.find((ship) => ship.id === shipId)!;
      const coordinate = ship.coordinates.find(
        (coordinate) => coordinate.code === code
      )!;

      coordinate.isImpacted = true;
      this.board.updateShipStatus(code, {
        status: ship.isDestroyed ? 'destroyed' : 'impacted',
        coordinates: ship.coordinates.map(coordinate => coordinate.code)
      })
    }

    this.afterUpdateBoard.next();
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
  askOpponent(cell: BoardCell) {
    if(!this.hasActiveTurn) return;
    this.play.next({ coordinate: cell.coordinate, shipId: cell.ship?.id })
  }
}

export class ComputerPlayer extends Player {
  askOpponent(board: Board) {
    const row = Math.floor(Math.random() * 10) + 1
    const col = Math.floor(Math.random() * 10) + 1
    const coordinate = `${row}:${col}`;
    const cell = board.cells.get(coordinate)!
    this.play.next({ coordinate: cell.coordinate, shipId: cell.ship?.id })
  }
}
