import { create } from "zustand";
import { imagesTest, mockData } from "../../public/mockData";
import { TierList } from "../pages/TierList";

interface TierListState {
  tierList: TierList[];
  tierListItems: string[];
  isRowModalOpen: boolean;
  rowModalIndex: number;
  setTierList: (tierList: TierList[]) => void;
  setTierListItems: (tierListItems: string[]) => void;
  changeRowModalIndex: (index: number) => void;
  changeRowModalState: (trueOrfalse: boolean) => void;
}

export const useTierListStore = create<TierListState>()((set) => ({
  tierList: mockData,
  tierListItems: imagesTest,
  isRowModalOpen: false,
  rowModalIndex: 0,
  setTierList: (tierList) => set((state) => ({ tierList })),
  setTierListItems: (tierListItems) => set((state) => ({ tierListItems })),
  changeRowModalIndex: (index) => set((state) => ({ rowModalIndex: index })),
  changeRowModalState: (trueOrfalse) =>
    set((state) => ({ isRowModalOpen: trueOrfalse })),
}));
