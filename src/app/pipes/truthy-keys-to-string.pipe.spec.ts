import { TruthyKeysToStringPipe } from './truthy-keys-to-string.pipe';

describe('TruthyKeysToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new TruthyKeysToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
