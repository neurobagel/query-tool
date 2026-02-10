import { Tooltip, ButtonGroup, Button } from '@mui/material';
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
    <ButtonGroup
      data-cy="modality-buttons"
      sx={{
        boxShadow: 'none',
        '& .MuiButtonGroup-grouped:not(:last-of-type)': {
          borderRight: '2px solid #ffffff !important',
        },
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
                }}
              >
                {metadata.Abbreviation ?? metadata.Label ?? modal}
              </Button>
            </Tooltip>
          );
        })}
    </ButtonGroup>
  ) : (
    <Button disabled sx={{ textTransform: 'none', fontStyle: 'italic' }} disableElevation>
      No imaging modalities available
    </Button>
  );
}

export default ImagingModalitiesColumn;
