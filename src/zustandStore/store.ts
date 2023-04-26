import { create } from "zustand";
import {
  DragEnterDataTransfer,
  TierList,
  TierListItem,
} from "../pages/TierList";

interface TierListState {
  tierList: TierList[];
  tierListItems: TierListItem[];
  dragEnterDataTransfer: DragEnterDataTransfer;
  dragEnterPreviewItemIndex: number;
  isRowModalOpen: boolean;
  isDownloadModalOpen: boolean;
  rowModalIndex: number;
  tierListCanvas: HTMLCanvasElement | null;
  isNotificationOnScreen: boolean;
  notificationText: string;
  setTierList: (tierList: TierList[]) => void;
  setTierListItems: (tierListItems: TierListItem[]) => void;
  setDragEnterDataTransfer: (data: DragEnterDataTransfer) => void;
  setDragEnterPreviewItemIndex: (index: number) => void;
  changeRowModalIndex: (index: number) => void;
  changeRowModalState: (trueOrfalse: boolean) => void;
  changeDownloadModalState: (trueOrfalse: boolean) => void;
  setTierListCanvas: (canvas: HTMLCanvasElement) => void;
  setIsNotificationOnScreen: (boolean: boolean) => void;
  setNotificationText: (text: string) => void;
}

export const useTierListStore = create<TierListState>()((set) => ({
  tierList: [],
  tierListItems: [],
  dragEnterDataTransfer: {
    src: "",
    tierListItemIndex: undefined,
    dragStartRowIndex: undefined,
    isItemSelected: false,
    tierListNotSelectedItemIndex: undefined,
  },
  dragEnterPreviewItemIndex: 0,
  isRowModalOpen: false,
  isDownloadModalOpen: false,
  rowModalIndex: 0,
  tierListCanvas: null,
  isNotificationOnScreen: false,
  notificationText: "",
  setTierList: (tierList) => set((state) => ({ tierList })),
  setTierListItems: (tierListItems) => set((state) => ({ tierListItems })),
  setDragEnterDataTransfer: (data) =>
    set((state) => ({ dragEnterDataTransfer: data })),
  setDragEnterPreviewItemIndex: (index) =>
    set((state) => ({ dragEnterPreviewItemIndex: index })),
  changeRowModalIndex: (index) => set((state) => ({ rowModalIndex: index })),
  changeRowModalState: (trueOrfalse) =>
    set((state) => ({ isRowModalOpen: trueOrfalse })),
  changeDownloadModalState: (trueOrfalse) =>
    set((state) => ({ isDownloadModalOpen: trueOrfalse })),
  setTierListCanvas: (canvas: HTMLCanvasElement) =>
    set((state) => ({ tierListCanvas: canvas })),
  setIsNotificationOnScreen: (boolean) =>
    set((state) => ({ isNotificationOnScreen: boolean })),
  setNotificationText: (text) => set((state) => ({ notificationText: text })),
}));
