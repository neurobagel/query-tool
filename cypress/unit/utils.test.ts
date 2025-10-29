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

  it('returns NaN for invalid numeric string', () => {
    expect(Number.isNaN(parseNumericValue('abc'))).to.equal(true);
  });

  it('returns NaN for mixed alphanumeric string', () => {
    expect(Number.isNaN(parseNumericValue('12abc'))).to.equal(true);
  });

  it('returns NaN for special characters', () => {
    expect(Number.isNaN(parseNumericValue('!@#'))).to.equal(true);
  });
});
