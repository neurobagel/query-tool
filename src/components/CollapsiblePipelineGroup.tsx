import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Typography,
  AutocompleteRenderGroupParams,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FieldInputOption } from '../utils/types';

interface CollapsiblePipelineGroupProps {
  params: AutocompleteRenderGroupParams;
  selectedPipelines: FieldInputOption[];
  selectedVersions: FieldInputOption[];
  onTogglePipeline: (pId: string, pLabel: string) => void;
}

function CollapsiblePipelineGroup({
  params,
  selectedPipelines,
  selectedVersions,
  onTogglePipeline,
}: CollapsiblePipelineGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pLabel = params.group;
  const isPipelineInName = selectedPipelines.some((p) => p.label === pLabel);
  const pId = selectedPipelines.find((p) => p.label === pLabel)?.id ?? `np:${pLabel}`;
  const hasSelectedVersion = selectedVersions.some((v) => v.id.startsWith(`${pId}::`));

  const isPipelineChecked = isPipelineInName && !hasSelectedVersion;

  return (
    <li key={params.key}>
      <Accordion
        expanded={isExpanded}
        onChange={() => setIsExpanded((prev) => !prev)}
        elevation={0}
        square
        disableGutters
        sx={{
          backgroundColor: 'transparent',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon fontSize="small" />}
          sx={{
            minHeight: 36,
            maxHeight: 36,
            px: 1,
            py: 0,
            '&.Mui-expanded': { minHeight: 36, maxHeight: 36 },
            '&:hover': { backgroundColor: 'action.hover' },
            '.MuiAccordionSummary-content': {
              my: 0,
              alignItems: 'center',
              '&.Mui-expanded': { my: 0 },
            },
          }}
        >
          <Checkbox
            data-cy={`pipeline-group-${pId}-checkbox`}
            size="small"
            checked={isPipelineChecked}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePipeline(pId, pLabel);
            }}
          />
          <Typography variant="body2" fontWeight={600} sx={{ ml: 0.5 }}>
            {pLabel}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <ul>{params.children}</ul>
        </AccordionDetails>
      </Accordion>
    </li>
  );
}

export default CollapsiblePipelineGroup;
