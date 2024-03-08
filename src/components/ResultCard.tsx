import { memo } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { modalities } from '../utils/constants';

const ResultCard = memo(
  ({
    nodeName,
    datasetUUID,
    datasetName,
    datasetTotalSubjects,
    numMatchingSubjects,
    imageModals,
    checked,
    onCheckboxChange,
  }: {
    nodeName: string;
    datasetName: string;
    datasetUUID: string;
    datasetTotalSubjects: number;
    numMatchingSubjects: number;
    imageModals: string[];
    checked: boolean;
    onCheckboxChange: (id: string) => void;
  }) => (
    <Card data-cy={`card-${datasetUUID}`}>
      <CardContent>
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-end-1">
            <FormControlLabel
              control={
                <Checkbox
                  data-cy={`card-${datasetUUID}-checkbox`}
                  checked={checked}
                  onChange={() => onCheckboxChange(datasetUUID)}
                />
              }
              label={datasetName}
            />
          </div>
          <div className="col-span-10 col-start-1">
            <Typography variant="h5">{datasetName}</Typography>
            <Typography variant="subtitle1">from {nodeName}</Typography>
            <Typography variant="subtitle2">
              {numMatchingSubjects} subjects match / {datasetTotalSubjects} total subjects
            </Typography>
          </div>
          <div className="col-span-2 justify-self-end">
            <ButtonGroup>
              {imageModals.sort().map((modal) => (
                <Button
                  key={modal}
                  variant="contained"
                  className={`${modalities[modal].bgColor} hover:bg-gray-400`}
                >
                  {modalities[modal].name}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);

export default ResultCard;
