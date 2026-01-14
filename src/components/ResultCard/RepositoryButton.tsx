import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface RepositoryButtonProps {
  repositoryUrl: string | null;
  datasetUuid: string;
}

function RepositoryButton({ repositoryUrl, datasetUuid }: RepositoryButtonProps) {
  if (!repositoryUrl) {
    return (
      <Button
        data-cy={`card-${datasetUuid}-repository-button`}
        variant="outlined"
        disableElevation
        size="small"
        disabled
        sx={{ textTransform: 'none' }}
        endIcon={<OpenInNewIcon />}
      >
        Repository
      </Button>
    );
  }
  return (
    <Button
      data-cy={`card-${datasetUuid}-repository-button`}
      variant="outlined"
      disableElevation
      size="small"
      href={repositoryUrl}
      target="_blank"
      sx={{ textTransform: 'none' }}
      endIcon={<OpenInNewIcon />}
    >
      Repository
    </Button>
  );
}

export default RepositoryButton;
