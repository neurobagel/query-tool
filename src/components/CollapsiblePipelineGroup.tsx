import { useState, ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FieldInputOption } from '../utils/types';

interface CollapsiblePipelineGroupProps {
  groupKey: string | number;
  groupLabel: string;
  children: ReactNode;
  selectedPipelines: FieldInputOption[];
  selectedVersions: FieldInputOption[];
  onTogglePipeline: (pId: string, pLabel: string) => void;
}

function CollapsiblePipelineGroup({
  groupKey,
  groupLabel,
  children,
  selectedPipelines,
  selectedVersions,
  onTogglePipeline,
}: CollapsiblePipelineGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPipelineInName = selectedPipelines.some((p) => p.label === groupLabel);
  const pId = selectedPipelines.find((p) => p.label === groupLabel)?.id ?? `np:${groupLabel}`;
  const hasSelectedVersion = selectedVersions.some((v) => v.id.startsWith(`${pId}::`));

  const isPipelineChecked = isPipelineInName && !hasSelectedVersion;

  return (
    <li key={groupKey}>
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
              onTogglePipeline(pId, groupLabel);
            }}
          />
          <Typography variant="body2" fontWeight={600} sx={{ ml: 0.5 }}>
            {groupLabel}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <ul>{children}</ul>
        </AccordionDetails>
      </Accordion>
    </li>
  );
}

export default CollapsiblePipelineGroup;
