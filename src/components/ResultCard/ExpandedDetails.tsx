import { Divider, Stack, Box, Typography, Chip, Button } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RepositoryButton from './RepositoryButton';

interface ExpandedDetailsProps {
  datasetUuid: string;
  keywords: string[];
  authors: string[];
  accessInstructions: string | null;
  accessLink: string | null;
  accessEmail: string | null;
  repositoryUrl: string | null;
  referencesAndLinks: string[];
}

function ExpandedDetails({
  datasetUuid,
  keywords,
  authors,
  accessInstructions,
  accessLink,
  accessEmail,
  repositoryUrl,
  referencesAndLinks,
}: ExpandedDetailsProps) {
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={2}>
        {/* Keywords */}
        <Box data-cy={`card-${datasetUuid}-keywords`}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Keywords
          </Typography>
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {keywords.map((k) => (
                <Chip key={k} label={k} size="small" />
              ))}
            </div>
          ) : (
            <Typography variant="body2" color="text.disabled" fontStyle="italic">
              No keywords available
            </Typography>
          )}
        </Box>

        {/* Full Authors */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Authors
          </Typography>
          {authors.length > 0 ? (
            <Typography variant="body2">{authors.join(', ')}</Typography>
          ) : (
            <Typography variant="body2" color="text.disabled" fontStyle="italic">
              No authors listed
            </Typography>
          )}
        </Box>

        {/* Access Instructions */}
        <Box data-cy={`card-${datasetUuid}-access`}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Access
          </Typography>
          {(() => {
            const showButtons = Boolean(accessLink || accessEmail || repositoryUrl);
            return accessInstructions ? (
              <Typography variant="body2" sx={{ mb: showButtons ? 1 : 0 }}>
                {accessInstructions}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                color="text.disabled"
                fontStyle="italic"
                sx={{ mb: showButtons ? 1 : 0 }}
              >
                No access instructions
              </Typography>
            );
          })()}

          <div className="flex gap-2">
            {accessLink ? (
              <Button
                data-cy={`card-${datasetUuid}-access-data-button`}
                variant="outlined"
                disableElevation
                size="small"
                href={accessLink}
                target="_blank"
                endIcon={<OpenInNewIcon />}
              >
                Access Data
              </Button>
            ) : (
              <Button
                data-cy={`card-${datasetUuid}-access-data-button`}
                variant="outlined"
                disableElevation
                size="small"
                disabled
                endIcon={<OpenInNewIcon />}
              >
                Access Data
              </Button>
            )}
            {accessEmail ? (
              <Button
                data-cy={`card-${datasetUuid}-access-contact-button`}
                variant="outlined"
                size="small"
                href={`mailto:${accessEmail}`}
                endIcon={<OpenInNewIcon />}
              >
                Contact
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                disabled
                endIcon={<OpenInNewIcon />}
                data-cy={`card-${datasetUuid}-access-contact-button`}
              >
                Contact
              </Button>
            )}
            <RepositoryButton repositoryUrl={repositoryUrl} datasetUuid={datasetUuid} />
          </div>
        </Box>
        {/* References */}
        <Box data-cy={`card-${datasetUuid}-references`}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            References
          </Typography>
          {referencesAndLinks.length > 0 ? (
            <Stack spacing={0.5}>
              {referencesAndLinks.map((link) => (
                <Typography key={link} variant="body2" sx={{ wordBreak: 'break-all' }}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </Typography>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.disabled" fontStyle="italic">
              No references available
            </Typography>
          )}
        </Box>
      </Stack>
    </>
  );
}

export default ExpandedDetails;
