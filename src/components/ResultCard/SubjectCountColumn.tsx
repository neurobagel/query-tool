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
      <div className="mt-1">
        {isCatalog ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Unknown / {datasetTotalSubjects}
          </Typography>
        ) : (
          <div className="flex items-baseline gap-1.5">
            <Typography
              variant="h4"
              component="span"
              sx={{ color: '#0891b2', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              {numMatchingSubjects}
            </Typography>
            <Typography
              variant="subtitle1"
              component="span"
              color="text.secondary"
              sx={{ fontWeight: 'bold' }}
            >
              / {datasetTotalSubjects}
            </Typography>
          </div>
        )}
      </div>
    </>
  );
}

export default SubjectCountColumn;
