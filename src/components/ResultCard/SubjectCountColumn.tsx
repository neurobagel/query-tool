import { Typography } from '@mui/material';

interface SubjectCountColumnProps {
  numMatchingSubjects: number;
  datasetTotalSubjects: number;
}

function SubjectCountColumn({
  numMatchingSubjects,
  datasetTotalSubjects,
}: SubjectCountColumnProps) {
  return (
    <>
      <Typography variant="body2" fontWeight="bold">
        Matching subjects:
      </Typography>
      <Typography variant="h6">
        {numMatchingSubjects} / {datasetTotalSubjects}
      </Typography>
    </>
  );
}

export default SubjectCountColumn;
