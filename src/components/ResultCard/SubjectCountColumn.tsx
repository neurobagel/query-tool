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
    <div className="col-span-3 flex flex-col justify-center">
      <Typography variant="body2" fontWeight="bold">
        Matching subjects:
      </Typography>
      <Typography variant="h6">
        {numMatchingSubjects} / {datasetTotalSubjects}
      </Typography>
    </div>
  );
}

export default SubjectCountColumn;
