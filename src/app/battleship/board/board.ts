import { numberToLetter } from 'src/app/utils/number-to-letter.util';
import { randomBoolean } from 'src/app/utils/random-boolean';
import { v4 as uuid } from 'uuid';

export interface BoardItem {
  code: string;
  value: string;
  cell?: {
    state: undefined | 'impact' | 'destroyed' | 'failed'
  };
  ship?: {
    // TODO: optimize this id attr
    id: string;
    start: boolean;
    end: boolean;
    horizontal: boolean;
  };
}

export class Board {
  private aditionalRowCols = 1;
  public matrix: BoardItem[][] = [];
  public internalDimention: number;

  constructor(public dimention: number) {
    this.internalDimention = this.dimention + this.aditionalRowCols;
    this.matrix = this.buildMatrix();
  }

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
  }

  addShip(size: number, isHorizontal = false): void {
    const rowOrCol = Math.ceil(Math.random() * this.dimention);
    const positions = Array.from({ length: size }, (_, i) => i + this.aditionalRowCols);
    const start = Math.ceil(Math.random() * (this.dimention - size));

    const overlaps: boolean = positions
      .map((position) =>
        isHorizontal
          ? !!this.matrix[rowOrCol][position + start].ship
          : !!this.matrix[position + start][rowOrCol].ship
      )
      .some((overlap) => overlap);

    if (overlaps) return this.addShip(size, isHorizontal);

    positions.forEach(position => {
      const config = {
        id: uuid(),
        start: position === 1,
        end: position === positions.length,
        horizontal: isHorizontal,
      }
      if (isHorizontal) {
        this.matrix[rowOrCol][position + start].ship = config;
      } else {
        this.matrix[position + start][rowOrCol].ship = config;
      }
    })
  }

  addBulkShips(sizes: number[]) {
    sizes.forEach(size => this.addShip(size, randomBoolean()))
  }
}
