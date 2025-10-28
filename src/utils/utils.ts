import { FieldInput, QueryFormState } from './types';

function normalizeFieldInput(input: FieldInput): string {
  if (input === null) {
    return 'null';
  }

  if (Array.isArray(input)) {
    const ids = input.map((option) => option.id).sort();
    return `multi:${ids.join('|')}`;
  }

  return `single:${input.id}`;
}

function areFieldInputsEqual(a: FieldInput, b: FieldInput): boolean {
  return normalizeFieldInput(a) === normalizeFieldInput(b);
}

function areStringArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((value, index) => value === sortedB[index]);
}

export default function areFormStatesEqual(a: QueryFormState, b: QueryFormState): boolean {
  return (
    areStringArraysEqual(a.nodes, b.nodes) &&
    a.minAge === b.minAge &&
    a.maxAge === b.maxAge &&
    areFieldInputsEqual(a.sex, b.sex) &&
    areFieldInputsEqual(a.diagnosis, b.diagnosis) &&
    a.minNumImagingSessions === b.minNumImagingSessions &&
    a.minNumPhenotypicSessions === b.minNumPhenotypicSessions &&
    areFieldInputsEqual(a.assessmentTool, b.assessmentTool) &&
    areFieldInputsEqual(a.imagingModality, b.imagingModality) &&
    areFieldInputsEqual(a.pipelineName, b.pipelineName) &&
    areFieldInputsEqual(a.pipelineVersion, b.pipelineVersion)
  );
}
