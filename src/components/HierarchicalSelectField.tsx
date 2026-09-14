import { useMemo } from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { HierarchicalOption } from '../utils/types';
import CollapsibleSelectGroup from './CollapsibleSelectGroup';

export interface HierarchicalSelectFieldProps {
  label: string;
  placeholder?: string;
  options: HierarchicalOption[];
  value: HierarchicalOption[];
  onFieldChange: (selected: HierarchicalOption[]) => void;
  disabled?: boolean;
  dataCy?: string;
  groupCheckboxDataCyPrefix?: string;
}

/**
 * A generic multi-select MUI autocomplete field for hierarchical data (groups and child options).
 *
 * Renders options grouped by `parentId` inside collapsible accordion groups.
 * Supports:
 * - Selecting an entire top-level group via the group header checkbox.
 * - Selecting individual child options under an expanded group.
 * - Tri-state/indeterminate visual indication when a subset of child options is selected.
 */
function HierarchicalSelectField({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onFieldChange,
  disabled = false,
  dataCy,
  groupCheckboxDataCyPrefix,
}: HierarchicalSelectFieldProps) {
  const parentLabelMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const opt of options) {
      if (!map[opt.parentId]) {
        map[opt.parentId] = opt.parentLabel;
      }
    }
    return map;
  }, [options]);

  const handleToggleGroup = (parentId: string, parentLabel: string) => {
    const isTopLevelOptionChecked = value.some(
      (opt) => opt.parentId === parentId && opt.isTopLevel
    );

    let updatedValue: HierarchicalOption[];
    if (isTopLevelOptionChecked) {
      // Uncheck parent: remove all selections for this group
      updatedValue = value.filter((opt) => opt.parentId !== parentId);
    } else {
      // Check parent: clear any specific child options and add the top-level group option
      const filtered = value.filter((opt) => opt.parentId !== parentId);
      updatedValue = [
        ...filtered,
        {
          id: parentId,
          label: `${parentLabel} any version`,
          parentId,
          parentLabel,
          isTopLevel: true,
        },
      ];
    }

    onFieldChange(updatedValue);
  };

  const handleAutocompleteChange = (_: unknown, newOptions: HierarchicalOption[]) => {
    // If a specific child option was selected, remove any top-level option for that group
    const parentsWithSpecificChildren = new Set(
      newOptions.filter((opt) => !opt.isTopLevel).map((opt) => opt.parentId)
    );

    const filteredOptions = newOptions.filter(
      (opt) => !opt.isTopLevel || !parentsWithSpecificChildren.has(opt.parentId)
    );

    onFieldChange(filteredOptions);
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      data-cy={dataCy}
      options={options}
      value={value}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      getOptionLabel={(option) => option.label}
      groupBy={(option) => option.parentId}
      renderGroup={({ key, group, children }) => {
        const parentLabel = parentLabelMap[group] ?? group;
        const isTopLevelOptionChecked = value.some(
          (opt) => opt.parentId === group && opt.isTopLevel
        );
        const isGroupIndeterminate =
          !isTopLevelOptionChecked &&
          value.some((opt) => opt.parentId === group && !opt.isTopLevel);

        return (
          <CollapsibleSelectGroup
            key={key}
            groupKey={key}
            groupId={group}
            groupLabel={parentLabel}
            isGroupChecked={isTopLevelOptionChecked}
            isGroupIndeterminate={isGroupIndeterminate}
            groupCheckboxDataCyPrefix={groupCheckboxDataCyPrefix}
            onToggleGroup={handleToggleGroup}
          >
            {children}
          </CollapsibleSelectGroup>
        );
      }}
      renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} />}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.id}>
          <Checkbox size="small" sx={{ mr: 1 }} checked={selected} />
          {option.label}
        </li>
      )}
      onChange={handleAutocompleteChange}
      disabled={disabled}
    />
  );
}

export default HierarchicalSelectField;
