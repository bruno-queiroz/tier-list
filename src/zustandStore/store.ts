import { create } from "zustand";
import { mockData } from "../../public/mockData";
import { TierList } from "../pages/TierList";

interface TierListState {
  tierList: TierList[];
  isRowModalOpen: boolean;
  rowModalIndex: number;
  setTierList: (tierList: TierList[]) => void;
  changeRowModalIndex: (index: number) => void;
  changeRowModalState: (trueOrfalse: boolean) => void;
}

export const useTierListStore = create<TierListState>()((set) => ({
  tierList: mockData,
  isRowModalOpen: false,
  rowModalIndex: 0,
  setTierList: (tierList) => set((state) => ({ tierList })),
  changeRowModalIndex: (index) => set((state) => ({ rowModalIndex: index })),
  changeRowModalState: (trueOrfalse) =>
    set((state) => ({ isRowModalOpen: trueOrfalse })),
}));
