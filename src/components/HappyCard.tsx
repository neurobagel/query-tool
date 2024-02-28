
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

function HappyCard() {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-12 items-center gap-2">
          <div className="col-end-1">
            <Checkbox
            />
          </div>
          <div className="col-span-10 col-start-1">
            <Typography variant="h5">I am a dataset</Typography>
            <Typography variant="subtitle1">from a Place</Typography>
            <Typography variant="subtitle2">
              some subjects match / more total subjects
            </Typography>
          </div>
          <div className="col-span-2 justify-self-end" />
        </div>
      </CardContent>
    </Card>
  );
}

export default HappyCard;
