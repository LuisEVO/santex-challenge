import { numberToLetter } from 'src/app/utils/number-to-letter.util';
import { randomBoolean } from 'src/app/utils/random-boolean';
import { v4 as uuid } from 'uuid';

export interface BoardItem {
  code: string;
  value: string;
  cell?: {
    state: undefined | 'impact' | 'destroyed' | 'failed';
  };
  ship?: {
    // TODO: optimize this id attr
    id: string;
    start: boolean;
    end: boolean;
    horizontal: boolean;
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
  // public matrix: BoardItem[][] = [];
  public internalDimention: number;
  public ships: Ship[] = [];
  public matrix: Map<string, BoardItem> = new Map([]);

  constructor(public dimention: number) {
    this.internalDimention = this.dimention + this.aditionalRowCols;
    this.matrix = this.buildMatrix();
  }

  /*
  buildMatrix(): BoardItem[][] {
    return Array.from({ length: this.internalDimention }, (_, rowIndex) => {
      return Array.from({ length: this.internalDimention }, (_, colIndex) => {
        const value =
          rowIndex === 0
            ? colIndex > 0
              ? colIndex
              : ''
            : colIndex === 0
            ? numberToLetter(rowIndex)
            : '';

        return {
          code: `${rowIndex}:${colIndex}`,
          value,
          cell: !!(rowIndex && colIndex) ? {
            state: undefined
          } : undefined,
        } as BoardItem;
      });
    });
  } */

  buildMatrix(): Map<string, BoardItem> {
    const matrix: Map<string, BoardItem> = new Map([]);

    Array.from({ length: this.internalDimention }, (_, rowIndex) => {
      return Array.from({ length: this.internalDimention }, (_, colIndex) => {
        const value =
          rowIndex === 0
            ? colIndex > 0
              ? colIndex
              : ''
            : colIndex === 0
            ? numberToLetter(rowIndex)
            : '';

        const item = {
          code: `${rowIndex}:${colIndex}`,
          value,
          cell: !!(rowIndex && colIndex)
            ? {
                state: undefined,
              }
            : undefined,
        } as BoardItem;

        matrix.set(`${rowIndex}:${colIndex}`, item);
      });
    });

    return matrix;
  }

  /*   addShip(size: number, isHorizontal = false): void {
    const ship = new Ship(uuid());
    const rowOrCol = Math.ceil(Math.random() * this.dimention);
    const startRowOrCol = Math.ceil(Math.random() * (this.dimention - size)) + this.aditionalRowCols;
    const locations = Array.from({ length: size }, (_, i) => i + startRowOrCol);

    const overlaps: boolean = locations
      .map((location) =>
        isHorizontal
          ? !!this.matrix[rowOrCol][location].ship
          : !!this.matrix[location][rowOrCol].ship
      )
      .some((overlap) => overlap);

    if (overlaps) return this.addShip(size, isHorizontal);

    locations.forEach(location => {
      const config = {
        id: ship.id,
        start: location === startRowOrCol,
        end: location === locations.at(-1),
        horizontal: isHorizontal,
      }
      if (isHorizontal) {
        this.matrix[rowOrCol][location].ship = config;
        ship.addLocation(this.matrix[rowOrCol][location].code)
      } else {
        this.matrix[location][rowOrCol].ship = config;
        ship.addLocation(this.matrix[location][rowOrCol].code)
      }
    })
  } */

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
        !!this.matrix.get(code)!.ship;
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
      this.matrix.get(code)!.ship = config;
      ship.addLocation(code);
    });
  }

  addBulkShips(sizes: number[]) {
    sizes.forEach((size) => this.addShip(size, randomBoolean()));
  }

  touchCell(col: BoardItem) {
   /*  col.cell!.state = col.ship ? 'impact' : 'failed';

    if (col.ship) {
      const shipId = col.ship.id;
      const shipCols: BoardItem[] = [];

      this.matrix.forEach((row) => {
        shipCols.push(
          ...row.filter((col) => col.ship && col.ship.id === shipId)
        );
      });

      const isDestroyed = shipCols.every((col) => col.cell!.state === 'impact');
      if (isDestroyed)
        shipCols.forEach((col) => (col.cell!.state = 'destroyed'));
    } */
  }
}
