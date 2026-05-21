import { Typography } from '@mui/material';

interface SubjectCountColumnProps {
  numMatchingSubjects: number | null;
  datasetTotalSubjects: number;
}

function SubjectCountColumn({
  numMatchingSubjects,
  datasetTotalSubjects,
}: SubjectCountColumnProps) {
  const isCatalog = numMatchingSubjects === null;

  return (
    <>
      <Typography variant="body2" fontWeight="bold">
        Matching subjects:
      </Typography>
      <Typography variant="h6">
        {isCatalog ? (
          <>
            <span className="text-base italic text-gray-500">Unknown</span> / {datasetTotalSubjects}
          </>
        ) : (
          `${numMatchingSubjects} / ${datasetTotalSubjects}`
        )}
      </Typography>
    </>
  );
}

export default SubjectCountColumn;
