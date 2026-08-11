import { Tooltip, Button, Stack, Divider } from '@mui/material';
import { ImagingModalitiesMetadata } from '../../utils/types';
import { modalitiesDataTypeColorMapping } from '../../utils/constants';

interface ImagingModalitiesColumnProps {
  imageModals: string[];
  imagingModalitiesMetadata: ImagingModalitiesMetadata;
  datasetUuid: string;
}

function ImagingModalitiesColumn({
  imageModals,
  imagingModalitiesMetadata,
  datasetUuid,
}: ImagingModalitiesColumnProps) {
  return imageModals.length > 0 ? (
    <Stack
      direction="row"
      data-cy="modality-buttons"
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: '#ffffff', borderRightWidth: 2 }}
        />
      }
      sx={{
        boxShadow: 'none',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {imageModals
        .sort()
        .filter((modal) => {
          const metadata = imagingModalitiesMetadata[modal];
          return Boolean(metadata?.DataType && metadata?.Abbreviation);
        })
        .map((modal) => {
          const metadata = imagingModalitiesMetadata[modal]!;
          const dataType = metadata.DataType;
          const backgroundColor =
            dataType && modalitiesDataTypeColorMapping[dataType.toLowerCase()];

          return (
            <Tooltip key={modal} title={metadata.Label ?? modal} placement="top">
              <Button
                data-cy={`card-${datasetUuid}-${metadata.Abbreviation}-imaging-modality-button`}
                variant="contained"
                disableElevation
                sx={{
                  backgroundColor: backgroundColor ? `${backgroundColor} !important` : undefined,
                  '&:hover': {
                    backgroundColor: backgroundColor ? `${backgroundColor} !important` : undefined,
                    cursor: 'default',
                  },
                  padding: '2px 8px',
                  minWidth: 'auto',
                  borderRadius: 0,
                }}
              >
                {metadata.Abbreviation ?? metadata.Label ?? modal}
              </Button>
            </Tooltip>
          );
        })}
    </Stack>
  ) : (
    <Button disabled sx={{ textTransform: 'none', fontStyle: 'italic' }} disableElevation>
      No imaging modalities available
    </Button>
  );
}

export default ImagingModalitiesColumn;
