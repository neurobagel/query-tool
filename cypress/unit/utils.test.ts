import { parseNumericValue } from '../../src/utils/utils';

describe('parseNumericValue', () => {
  it('returns null for empty string', () => {
    expect(parseNumericValue('')).to.equal(null);
  });

  it('returns null for whitespace-only string', () => {
    expect(parseNumericValue('   ')).to.equal(null);
  });

  it('parses valid positive integer', () => {
    expect(parseNumericValue('42')).to.equal(42);
  });

  it('parses valid positive decimal', () => {
    expect(parseNumericValue('3.14')).to.equal(3.14);
  });

  it('parses valid negative number', () => {
    expect(parseNumericValue('-10')).to.equal(-10);
  });

  it('parses zero', () => {
    expect(parseNumericValue('0')).to.equal(0);
  });

  it('trims whitespace before parsing', () => {
    expect(parseNumericValue('  25  ')).to.equal(25);
  });

  it('returns null for invalid numeric string', () => {
    expect(parseNumericValue('abc')).to.equal(null);
  });

  it('returns null for mixed alphanumeric string', () => {
    expect(parseNumericValue('12abc')).to.equal(null);
  });

  it('returns null for special characters', () => {
    expect(parseNumericValue('!@#')).to.equal(null);
  });
});
