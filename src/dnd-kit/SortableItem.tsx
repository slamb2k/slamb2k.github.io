import type { CSSProperties, PropsWithChildren } from 'react';
import { type UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  id: UniqueIdentifier;
}

export function SortableItem({ children, id }: PropsWithChildren<Props>) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.5 : undefined,
    outline: isDragging ? '2px dashed #f87942' : undefined,
    zIndex: isDragging ? '2147483647' : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'grab',
    userSelect: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
