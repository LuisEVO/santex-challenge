import { v4 as uuid } from 'uuid';

export class Ship {
  id: string
  coordinates: {
    code: string;
    isImpacted: boolean;
  }[] = [];

  constructor() {
    this.id = uuid();
  }

  setCoordinates(codes: string[]) {
    this.coordinates.push(...codes.map(code => ({ code, isImpacted: false })));
  }

  get isDestroyed() {
    return this.coordinates.every((location) => location.isImpacted);
  }
}
