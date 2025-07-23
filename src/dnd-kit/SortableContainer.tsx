import React, { useEffect, useRef, useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion } from 'framer-motion';

import { useMoves } from './MoveContext';
import { SortableItem } from './SortableItem';
import { CONTANER_TYPE, SortableContainerProps, SORTING_STRAGETY } from './types';

export function SortableContainer({
  dndKitId,
  children,
  prevTag,
  containerType,
  ...props
}: SortableContainerProps) {
  const [isOver, setIsOver] = useState<Boolean>(false);
  const [strategy, setStrategy] = useState<SORTING_STRAGETY>(SORTING_STRAGETY.HORIZONTAL);
  const [isEditMode, setIsEditMode] = useState((window as any).__editModeActive || false);
  const { order, setOrder, addMove } = useMoves();

  const uniqueDndKitId = useMemo(
    () => (containerType === CONTANER_TYPE.TEMPLATE ? `${uuidv4()}/${dndKitId}` : dndKitId),
    [dndKitId, containerType]
  );

  const handleDragOver = ({ over }: DragOverEvent) => setIsOver(Boolean(over));

  const handleDragStart = () => {
    if (typeof (window as any).__startDragMode === 'function') {
      (window as any).__startDragMode();
    }
  };

  const handleDragCancel = () => {
    setIsOver(false);

    if (typeof (window as any).__endDragMode === 'function') {
      (window as any).__endDragMode();
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setIsOver(false);

    if (typeof (window as any).__endDragMode === 'function') {
      (window as any).__endDragMode();
    }

    if (!over || active.id === over.id) return;

    const list = order[uniqueDndKitId] || [];
    const oldIndex = list.indexOf(active.id as string);
    const newIndex = list.indexOf(over.id as string);

    const activeElement = React.Children.toArray(children)
      .filter(React.isValidElement)
      .find(
        el => getElementKey(el as React.ReactElement, containerType as CONTANER_TYPE) === active.id
      );

    if (activeElement && oldIndex !== -1 && newIndex !== -1) {
      addMove({
        containerId: uniqueDndKitId,
        oldIndex,
        newIndex,
        elementPath: (activeElement.props as any)['data-magicpath-path'],
        elementMagicId: active.id.toString(),
        type: containerType as CONTANER_TYPE,
      });
    }
  };

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateStrategy = () => {
      if (!containerRef.current) return;

      const style = window.getComputedStyle(containerRef.current);
      const { display, flexDirection, gridTemplateColumns } = style;

      if (
        (display === 'flex' || display === 'inline-flex') &&
        (flexDirection === 'row' || flexDirection === 'row-reverse')
      ) {
        return setStrategy(SORTING_STRAGETY.HORIZONTAL);
      }

      if (display === 'grid' || display === 'inline-grid') {
        const columnCount =
          gridTemplateColumns && gridTemplateColumns !== 'none'
            ? gridTemplateColumns.split(' ').length
            : 1;

        return setStrategy(
          columnCount > 1 ? SORTING_STRAGETY.HORIZONTAL : SORTING_STRAGETY.VERTICAL
        );
      }

      setStrategy(SORTING_STRAGETY.VERTICAL);
    };

    updateStrategy();

    const observer = new ResizeObserver(updateStrategy);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (!e.data || typeof e.data.type !== 'string') return;

      if (e.data.type === 'TOGGLE_EDIT_MODE') {
        setIsEditMode(!!e.data.active);
      }
    };

    window.addEventListener('message', listener);

    return () => window.removeEventListener('message', listener);
  }, []);

  useEffect(() => {
    setOrder(prev => {
      if (!prev[uniqueDndKitId]) {
        const initial = React.Children.toArray(children)
          .filter(React.isValidElement)
          .map(child => getElementKey(child as React.ReactElement, containerType as CONTANER_TYPE))
          .filter(el => Boolean(el)) as string[];

        return { ...prev, [uniqueDndKitId]: initial };
      }

      return prev;
    });
  }, [children, uniqueDndKitId, containerType]);

  const items = order[uniqueDndKitId] ?? [];

  const childMap = useMemo(() => {
    const map: Record<string, React.ReactNode> = {};

    React.Children.forEach(children, (child, index) => {
      if (React.isValidElement(child)) {
        const key = getElementKey(child, containerType as CONTANER_TYPE);

        if (key) {
          map[key] = child;
        }
      }
    });

    return map;
  }, [children, containerType]);

  const renderContent = (
    <SortableContext disabled={!isEditMode} items={items} strategy={strategyMapper[strategy]}>
      {items
        .filter(itemId => Boolean(childMap[itemId]))
        .map(itemId => {
          const child = childMap[itemId];

          return (
            <SortableItem key={itemId} id={itemId}>
              {child}
            </SortableItem>
          );
        })}
    </SortableContext>
  );

  const tagStyle = isOver
    ? {
        outline: '2px dashed #4ade80',
        background: `rgba(74, 222, 128, 0.12)`,
        transition: `background-color 120ms ease`,
      }
    : {};

  const renderContainer = (content: React.ReactNode) => {
    switch (prevTag) {
      case 'motion.div':
        return (
          <motion.div
            {...(props as any)}
            ref={containerRef as any}
            style={{ ...(props.style || {}), ...tagStyle }}
            className={props.className}
          >
            {content}
          </motion.div>
        );
      case 'motion.ul':
        return (
          <motion.ul
            {...(props as any)}
            ref={containerRef as any}
            style={{ ...(props.style || {}), ...tagStyle }}
            className={props.className}
          >
            {content}
          </motion.ul>
        );
      case 'motion.nav':
        return (
          <motion.nav
            {...(props as any)}
            ref={containerRef as any}
            style={{ ...(props.style || {}), ...tagStyle }}
            className={props.className}
          >
            {content}
          </motion.nav>
        );
      case 'motion.article':
        return (
          <motion.article
            {...(props as any)}
            ref={containerRef as any}
            style={{ ...(props.style || {}), ...tagStyle }}
            className={props.className}
          >
            {content}
          </motion.article>
        );
      case 'motion.section':
        return (
          <motion.section
            {...(props as any)}
            ref={containerRef as any}
            style={{ ...(props.style || {}), ...tagStyle }}
            className={props.className}
          >
            {content}
          </motion.section>
        );
      case 'motion.form':
        return (
          <motion.form
            {...(props as any)}
            ref={containerRef as any}
            style={{ ...(props.style || {}), ...tagStyle }}
            className={props.className}
          >
            {content}
          </motion.form>
        );
      default:
        return React.createElement(
          prevTag,
          {
            ...(props as any),
            ref: containerRef as any,
            style: { ...(props.style || {}), ...tagStyle },
            className: props.className,
          },
          content
        );
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 300,
        distance: 300,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      onDragStart={handleDragStart}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      {renderContainer(renderContent)}
    </DndContext>
  );
}

const getElementKey = (child: React.ReactElement, containerType: CONTANER_TYPE): string => {
  //@ts-ignore
  const magicUuid = child.props['data-magicpath-uuid'];
  //@ts-ignore
  const magicId = child.props['data-magicpath-id'];

  if (magicUuid && containerType === CONTANER_TYPE.COLLECTION) {
    return `${magicUuid}/${magicId}`;
  }

  return magicId || '';
};

const strategyMapper = {
  [SORTING_STRAGETY.VERTICAL]: verticalListSortingStrategy,
  [SORTING_STRAGETY.HORIZONTAL]: horizontalListSortingStrategy,
};
