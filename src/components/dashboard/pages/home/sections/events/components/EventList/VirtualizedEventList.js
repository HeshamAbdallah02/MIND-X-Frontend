//frontend/src/components/dashboard/pages/home/sections/events/components/EventList/VirtualizedEventList.js
import { FixedSizeList } from 'react-window';
import React from 'react';

const VirtualizedEventList = React.memo(({ events, Component, ...props }) => {
  const Row = React.useCallback(({ index, style }) => (
    <div style={{ ...style, zIndex: 1 }}>
      <Component event={events[index]} {...props} />
    </div>
  ), [events, props]);

  return (
    <FixedSizeList
      height={400}
      width="100%"
      itemSize={120}
      itemCount={events.length}
      overscanCount={5}
    >
      {Row}
    </FixedSizeList>
  );
});

export default VirtualizedEventList;