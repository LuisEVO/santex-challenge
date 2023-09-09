import { numberToLetter } from 'src/app/utils/number-to-letter.util';
import { randomBoolean } from 'src/app/utils/random-boolean';
import { v4 as uuid } from 'uuid';

export interface BoardCell {
  code: string;
  title: string;
  isClickable: boolean;
  isTouched: boolean;
  ship?: {
    // TODO: optimize this id attr
    id: string;
    start: boolean;
    end: boolean;
    horizontal: boolean;
    status?: 'impacted' | 'destroyed'
  };
}

class Ship {
  locations: {
    code: string;
    isImpacted: boolean;
  }[] = [];

  constructor(public id: string) {}

  addLocation(code: string) {
    this.locations.push({ code, isImpacted: false });
  }

  get isDestroyed() {
    return this.locations.every((location) => location.isImpacted);
  }
}
export class Board {
  private aditionalRowCols = 1;
  public internalDimention: number;
  public ships: Ship[] = [];
  public cells: Map<string, BoardCell> = new Map([]);

  constructor(public dimention: number) {
    this.internalDimention = this.dimention + this.aditionalRowCols;
    this.cells = this.buildMatrix();
  }

  buildMatrix(): Map<string, BoardCell> {
    const matrix: Map<string, BoardCell> = new Map([]);

    Array.from({ length: this.internalDimention }, (_, rowIndex) => {
      return Array.from({ length: this.internalDimention }, (_, colIndex) => {
        const title =
          rowIndex === 0
            ? colIndex > 0
              ? colIndex
              : ''
            : colIndex === 0
            ? numberToLetter(rowIndex)
            : '';

        const item = {
          code: `${rowIndex}:${colIndex}`,
          title,
          isClickable: !!(rowIndex && colIndex),
          isTouched: false
        } as BoardCell;

        matrix.set(`${rowIndex}:${colIndex}`, item);
      });
    });

    return matrix;
  }

  addShip(size: number, isHorizontal = false): void {
    const ship = new Ship(uuid());
    const rowOrCol = Math.ceil(Math.random() * this.dimention);
    const startRowOrCol =
      Math.ceil(Math.random() * (this.dimention - size)) +
      this.aditionalRowCols;
    const locations = Array.from({ length: size }, (_, i) => i + startRowOrCol);

    const overlaps: boolean = locations
      .map((location) => {
        const code = isHorizontal
          ? `${rowOrCol}:${location}`
          : `${location}:${rowOrCol}`;
        return !!this.cells.get(code)!.ship;
      })
      .some((overlap) => overlap);

    if (overlaps) return this.addShip(size, isHorizontal);

    locations.forEach((location) => {
      const config = {
        id: ship.id,
        start: location === startRowOrCol,
        end: location === locations.at(-1),
        horizontal: isHorizontal,
      };
      const code = isHorizontal
      ? `${rowOrCol}:${location}`
      : `${location}:${rowOrCol}`;
      this.cells.get(code)!.ship = config;
      ship.addLocation(code);
    });

    this.ships.push(ship);
  }

  addBulkShips(sizes: number[]) {
    sizes.forEach((size) => this.addShip(size, randomBoolean()));
  }

  touchCell(cell: BoardCell) {
    if (!cell.isClickable) return;
    cell!.isTouched = true;

    if (cell.ship) {
      const shipId = cell.ship.id;
      console.log(shipId);
      console.log(this.ships);

      const ship = this.ships.find(ship => ship.id === shipId)
      console.log(ship);

      const location = ship?.locations.find(location => location.code === cell.code)
      console.log(location);

      location!.isImpacted = true;
      cell.ship.status = 'impacted';

      if (ship?.isDestroyed) {
        ship?.locations.forEach(location => this.cells.get(location!.code)!.ship!.status = 'destroyed')
      }
    }
  }
}
