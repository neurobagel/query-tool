import { useState, ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface CollapsibleSelectGroupProps {
  groupKey: string | number;
  groupId: string;
  groupLabel: string;
  isGroupChecked: boolean;
  isGroupIndeterminate?: boolean;
  groupCheckboxDataCyPrefix?: string;
  children: ReactNode;
  onToggleGroup: (groupId: string, groupLabel: string) => void;
}

/**
 * A collapsible accordion group header used inside hierarchical select dropdowns.
 *
 * Renders an expandable group item with:
 * - A top-level checkbox representing the group itself.
 * - Support for checked, unchecked, and indeterminate (partially selected) states.
 * - An accordion toggle button to reveal/hide the list of individual child options.
 */
function CollapsibleSelectGroup({
  groupKey,
  groupId,
  groupLabel,
  isGroupChecked,
  isGroupIndeterminate = false,
  groupCheckboxDataCyPrefix = 'select-group',
  children,
  onToggleGroup,
}: CollapsibleSelectGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
            data-cy={`${groupCheckboxDataCyPrefix}-${groupId}-checkbox`}
            size="small"
            checked={isGroupChecked}
            indeterminate={isGroupIndeterminate}
            onClick={(e) => {
              e.stopPropagation();
              onToggleGroup(groupId, groupLabel);
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

export default CollapsibleSelectGroup;
