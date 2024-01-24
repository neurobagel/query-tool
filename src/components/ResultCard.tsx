import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { modalities } from '../utils/constants';

function ResultCard({
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
  onCheckboxChange: (checked: boolean, id: string) => void;
}) {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-end-1">
            <Checkbox
              checked={checked}
              onChange={(event) => onCheckboxChange(event.target.checked, datasetUUID)}
            />
          </div>
          <div className="col-span-10 col-start-1">
            <Tooltip
              title={<Typography variant="body1">{datasetName}</Typography>}
              placement="top"
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 500 }}
              enterDelay={500}
            >
              <Typography variant="h5" className="dataset-name">
                {datasetName}
              </Typography>
            </Tooltip>
            <Typography variant="subtitle1">from {nodeName}</Typography>
            <Typography variant="subtitle2">
              {numMatchingSubjects} subjects match / {datasetTotalSubjects} total subjects
            </Typography>
          </div>
          <div className="col-span-2 justify-self-end">
            <ButtonGroup>
              {/* TODO: fix the button's hover color issue */}
              {imageModals.sort().map((modal) => (
                <Button key={modal} variant="text" className={modalities[modal].style}>
                  {modalities[modal].name}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResultCard;
