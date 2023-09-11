export type AttackResult = 'failed' | 'impacted' | 'destroyed';

export const AttackResultMap: Map<AttackResult, string> = new Map([
  ['failed', 'No ship was hit'],
  ['impacted', 'A ship was hit'],
  ['destroyed', 'A ship was destroyed'],
]);
export class AttackRecord {
  constructor(public coordinate: string, public result: AttackResult) {}

  resultDisplay() {
    return AttackResultMap.get(this.result);
  }
}
