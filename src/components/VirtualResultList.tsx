import { ReactNode } from 'react';
import { List, type RowComponentProps, useDynamicRowHeight } from 'react-window';

const DEFAULT_ROW_HEIGHT = 280;

interface RenderProp {
  (props: { index: number; style: React.CSSProperties }): ReactNode;
}

function RowComponent({ index, items, style }: RowComponentProps<{ items: RenderProp }>) {
  return (
    <div style={style} className="w-full px-1 pb-3">
      {items({ index, style: {} })}
    </div>
  );
}

interface VirtualResultListProps {
  children: RenderProp;
  itemCount: number;
  listKey?: string;
}

function VirtualResultList({ children, itemCount, listKey }: VirtualResultListProps) {
  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: DEFAULT_ROW_HEIGHT,
    key: listKey,
  });

  return (
    <div className="relative h-full w-full overflow-hidden" data-cy="virtual-result-list">
      <List
        rowCount={itemCount}
        rowHeight={dynamicRowHeight}
        rowComponent={RowComponent}
        rowProps={{ items: children }}
        style={{ overflowX: 'hidden' }}
      />
    </div>
  );
}

export default VirtualResultList;
