import * as React from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { useState, useEffect, useCallback } from 'react';
import { CONTANER_TYPE, Move, MoveContextType, MoveHistory, Order } from './types';

const MoveContext = React.createContext<MoveContextType | null>(null);

export function MoveProvider({ children }: { children: React.ReactNode }) {

  const [order, setOrder] = useState<Order>({});
  const [pendingMove, setPendingMove] = useState<Move | null>(null);
  const [pendingUndoMove, setPendingUndoMove] = useState<Move | null>(null);
  const [history, setHistory] = useState<MoveHistory>({
    moves: [],
    currentIndex: -1,
  });

  useEffect(() => {
    if (pendingMove) {
      const cleanContainerId =
        pendingMove.type === CONTANER_TYPE.TEMPLATE
          ? pendingMove.containerId.split('/')[1]
          : pendingMove.containerId;

      window.parent.postMessage(
        {
          type: 'ELEMENT_MOVED',
          magicpathId: pendingMove.elementMagicId,
          magicpathPath: pendingMove.elementPath,
          move: {
            containerId: cleanContainerId,
            newIndex: pendingMove.newIndex,
            timestamp: pendingMove.timestamp,
            moveId: pendingMove.id,
            type: pendingMove.type,
          },
        },
        '*'
      );

      setPendingMove(null);
    }
  }, [pendingMove]);

  useEffect(() => {
    if (pendingUndoMove) {
      window.parent.postMessage(
        {
          type: 'UNDO_ELEMENT_MOVED',
          magicpathId: pendingUndoMove.elementMagicId,
          magicpathPath: pendingUndoMove.elementPath,
          moveId: pendingUndoMove.id,
        },
        '*'
      );

      setPendingUndoMove(null);
    }
  }, [pendingUndoMove]);

  function applyMove(prevOrder: Order, move: Move, targetIndex: number): Order {
    const { containerId, elementMagicId, type } = move;

    if (type === CONTANER_TYPE.TEMPLATE) {
      const templateId = containerId.split('/')[1];

      const keys = Object.keys(prevOrder).filter(k => k.includes(templateId));
      let foundIndex = -1;

      for (const key of keys) {
        const idx = prevOrder[key].indexOf(elementMagicId);

        if (idx !== -1) {
          foundIndex = idx;
          break;
        }
      }

      if (foundIndex === -1) return prevOrder;

      return keys.reduce(
        (acc, key) => {
          acc[key] = arrayMove(prevOrder[key], foundIndex, targetIndex);
          return acc;
        },
        { ...prevOrder }
      );
    }

    const list = prevOrder[containerId] ?? [];
    const currentIndex = list.indexOf(elementMagicId);

    if (currentIndex === -1) return prevOrder;

    return {
      ...prevOrder,
      [containerId]: arrayMove(list, currentIndex, targetIndex),
    };
  }

  const addMove = useCallback(
    (moveData: Omit<Move, 'id' | 'timestamp'>) => {
      const move: Move = {
        ...moveData,
        id: `move_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        timestamp: Date.now(),
      };

      setOrder(prev => applyMove(prev, move, move.newIndex));

      setHistory(prev => {
        if (prev.moves.some(m => m.id === move.id)) return prev;
        const moves = [...prev.moves.slice(0, prev.currentIndex + 1), move];
        return { moves, currentIndex: moves.length - 1 };
      });

      setPendingMove(move);
    },
    [setOrder]
  );

  const undo = useCallback(() => {
    if (history.currentIndex < 0) return;
    const move = history.moves[history.currentIndex];

    setHistory(h => ({ ...h, currentIndex: h.currentIndex - 1 }));
    setOrder(prev => applyMove(prev, move, move.oldIndex));
    setPendingUndoMove(move);
  }, [history, setOrder]);

  const redo = useCallback(() => {
    if (history.currentIndex >= history.moves.length - 1) return;
    const move = history.moves[history.currentIndex + 1];

    setHistory(h => ({ ...h, currentIndex: h.currentIndex + 1 }));
    setOrder(prev => applyMove(prev, move, move.newIndex));
    setPendingMove(move);
  }, [history, setOrder]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }

      if (
        ((event.ctrlKey && event.key === 'y') ||
          (event.metaKey && event.shiftKey && event.key === 'z')) &&
        !event.altKey
      ) {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const value: MoveContextType = {
    order,
    setOrder,
    addMove,
  };

  return <MoveContext.Provider value={value}>{children}</MoveContext.Provider>;
}

export function useMoves() {
  const context = React.useContext(MoveContext);
  if (!context) {
    throw new Error('useMoves must be used within MoveProvider');
  }
  return context;
}
