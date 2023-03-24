import { create } from "zustand";
import { imagesTest, mockData } from "../../public/mockData";
import { TierList, TierListItem } from "../pages/TierList";

interface TierListState {
  tierList: TierList[];
  tierListItems: TierListItem[];
  isRowModalOpen: boolean;
  isDownloadModalOpen: boolean;
  rowModalIndex: number;
  tierListCanvas: HTMLCanvasElement | null;
  setTierList: (tierList: TierList[]) => void;
  setTierListItems: (tierListItems: TierListItem[]) => void;
  changeRowModalIndex: (index: number) => void;
  changeRowModalState: (trueOrfalse: boolean) => void;
  changeDownloadModalState: (trueOrfalse: boolean) => void;
  setTierListCanvas: (canvas: HTMLCanvasElement) => void;
}

export const useTierListStore = create<TierListState>()((set) => ({
  tierList: mockData,
  tierListItems: imagesTest,
  isRowModalOpen: false,
  isDownloadModalOpen: false,
  rowModalIndex: 0,
  tierListCanvas: null,
  setTierList: (tierList) => set((state) => ({ tierList })),
  setTierListItems: (tierListItems) => set((state) => ({ tierListItems })),
  changeRowModalIndex: (index) => set((state) => ({ rowModalIndex: index })),
  changeRowModalState: (trueOrfalse) =>
    set((state) => ({ isRowModalOpen: trueOrfalse })),
  changeDownloadModalState: (trueOrfalse) =>
    set((state) => ({ isDownloadModalOpen: trueOrfalse })),
  setTierListCanvas: (canvas: HTMLCanvasElement) =>
    set((state) => ({ tierListCanvas: canvas })),
}));
