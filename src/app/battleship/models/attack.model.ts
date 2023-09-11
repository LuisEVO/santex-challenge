export type AttackResult = 'failed' | 'impacted' | 'destroyed';

export const AttackResultMap: Map<AttackResult, string> = new Map([
  ['failed', 'Falló el ataque'],
  ['impacted', 'Dió en el barco'],
  ['destroyed', 'Destruyó el barco'],
]);
export class AttackRecord {
  constructor(public coordinate: string, public result: AttackResult) {}

  resultDisplay() {
    return AttackResultMap.get(this.result);
  }
}
