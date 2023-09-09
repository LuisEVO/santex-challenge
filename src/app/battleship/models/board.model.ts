import { numberToLetter } from 'src/app/utils/number-to-letter.util';
import { randomBoolean } from 'src/app/utils/random-boolean';
import { Ship } from './ship.model';
import { truthyKeysToString } from 'src/app/utils/truthy-keys-to-string.util';
import { Subject } from 'rxjs';

export interface BoardCell {
  displayCode: string;
  coordinate: string;
  title: string;
  isClickable: boolean;
  isTouched: boolean;
  ship?: {
    id?: string;
    status?: string;
    classes?: string;
  };
}

export class Board {
  private aditionalRowCols = 1;
  public internalDimention: number;
  public cells: Map<string, BoardCell> = new Map([]);

  constructor(public dimention: number) {
    this.internalDimention = this.dimention + this.aditionalRowCols;
    this.cells = this.generateCells();
  }

  generateCells(): Map<string, BoardCell> {
    const cells: Map<string, BoardCell> = new Map([]);

    Array.from({ length: this.internalDimention }, (_, rowIndex) => {
      return Array.from({ length: this.internalDimention }, (_, colIndex) => {
        const title =
          rowIndex === 0
            ? colIndex > 0
              ? String(colIndex)
              : ''
            : colIndex === 0
            ? numberToLetter(rowIndex)
            : '';

        const cell: BoardCell = {
          displayCode: !!(rowIndex && colIndex) ? `${numberToLetter(rowIndex)}:${colIndex}` : '',
          coordinate: `${rowIndex}:${colIndex}`,
          title,
          isClickable: !!(rowIndex && colIndex),
          isTouched: false,
        };

        cells.set(cell.coordinate, cell);
      });
    });

    return cells;
  }

  addShip(shipId: string, size: number, isHorizontal = false): string[] {
    const rowOrCol = Math.floor(Math.random() * this.dimention) + this.aditionalRowCols;
    const startRowOrCol = Math.floor(Math.random() * (this.dimention - size)) + this.aditionalRowCols;
    const positions = Array.from({ length: size }, (_, i) => i + startRowOrCol);

    const overlaps: boolean = positions
      .map((position) => {
        const coordinate = isHorizontal
          ? `${rowOrCol}:${position}`
          : `${position}:${rowOrCol}`;
        return !!this.cells.get(coordinate)?.ship;
      })
      .some((overlap) => overlap);

    if (overlaps) return this.addShip(shipId, size, isHorizontal);

    const coordinates = positions.map((position) => {
      const classes = truthyKeysToString({
        ship: true,
        start: position === startRowOrCol,
        end: position === positions.at(-1),
        horizontal: isHorizontal,
      });
      const coordinate = isHorizontal
        ? `${rowOrCol}:${position}`
        : `${position}:${rowOrCol}`;
      this.cells.get(coordinate)!.ship = { id: shipId, classes };
      return coordinate;
    });

    return coordinates;
  }

  cleanShips() {
    for (let cell of this.cells.values()) {
      cell.ship = undefined;
    }
  }

  updateShipStatus(
    coordinate: string,
    ship: { status: 'impacted' | 'destroyed'; coordinates: string[] }
  ) {
    switch (ship.status) {
      case 'impacted':
        this.cells.get(coordinate)!.ship!.status = 'impacted';
        break;
      case 'destroyed':
        ship.coordinates.forEach(
          (coordinate) => (this.cells.get(coordinate)!.ship!.status = 'destroyed')
        );
        break;
    }
  }

  canTouchCell(coordinate: string) {
    const cell = this.cells.get(coordinate)!;
    if (cell.isClickable && !cell.isTouched) {

    } else {
      console.log(cell.coordinate);

    }
    return cell.isClickable && !cell.isTouched;
  }

  touchCell(coordinate: string) {
    this.cells.get(coordinate)!.isTouched = true;
  }
}
