import { HTMLMotionProps } from 'framer-motion';

export enum CONTANER_TYPE {
  COLLECTION = 'collection',
  TEMPLATE = 'template',
  REGULAR = 'regular',
}

export enum SORTING_STRAGETY {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export interface SortableContainerProps extends Record<string, any> {
  dndKitId: string;
  prevTag: string;
  children?: React.ReactNode;
  containerType: string;
}

export interface Move {
  id: string;
  timestamp: number;
  containerId: string;
  oldIndex: number;
  newIndex: number;
  elementPath: string;
  elementMagicId: string;
  type: CONTANER_TYPE;
}

export interface MoveHistory {
  moves: Move[];
  currentIndex: number;
}

export type Order = Record<string, string[]>;

export interface MoveContextType {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  addMove: (move: Omit<Move, 'id' | 'timestamp'>) => void;
}
