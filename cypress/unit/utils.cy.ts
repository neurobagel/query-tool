import areFormStatesEqual, { parseNumericValue } from '../../src/utils/utils';

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

describe('areFormStatesEqual', () => {
  const baseState = {
    nodes: ['node1'],
    minAge: '20',
    maxAge: '50',
    sex: { id: 'male', label: 'Male' },
    diagnosis: null,
    minNumImagingSessions: '1',
    minNumPhenotypicSessions: '1',
    assessmentTool: null,
    imagingModality: null,
    selectedPipelines: [{ pipelineId: 'np:fmriprep', pipelineLabel: 'fmriprep', version: '0.2.3' }],
  };

  it('returns true when form states are identical', () => {
    expect(areFormStatesEqual(baseState, { ...baseState })).to.equal(true);
  });

  it('returns true when selectedPipelines have the same elements in different order', () => {
    const stateA = {
      ...baseState,
      selectedPipelines: [
        { pipelineId: 'np:fmriprep', pipelineLabel: 'fmriprep', version: '0.2.3' },
        { pipelineId: 'np:mriqc', pipelineLabel: 'mriqc' },
      ],
    };
    const stateB = {
      ...baseState,
      selectedPipelines: [
        { pipelineId: 'np:mriqc', pipelineLabel: 'mriqc' },
        { pipelineId: 'np:fmriprep', pipelineLabel: 'fmriprep', version: '0.2.3' },
      ],
    };
    expect(areFormStatesEqual(stateA, stateB)).to.equal(true);
  });

  it('returns false when selectedPipelines differ in version', () => {
    const stateA = {
      ...baseState,
      selectedPipelines: [
        { pipelineId: 'np:fmriprep', pipelineLabel: 'fmriprep', version: '0.2.3' },
      ],
    };
    const stateB = {
      ...baseState,
      selectedPipelines: [
        { pipelineId: 'np:fmriprep', pipelineLabel: 'fmriprep', version: '23.1.3' },
      ],
    };
    expect(areFormStatesEqual(stateA, stateB)).to.equal(false);
  });

  it('returns false when selectedPipelines differ in length', () => {
    const stateA = {
      ...baseState,
      selectedPipelines: [],
    };
    expect(areFormStatesEqual(stateA, baseState)).to.equal(false);
  });
});
