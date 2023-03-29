import { TierList } from "../pages/TierList";

export const clearItemPreviewAllRows = (tierList: TierList[]) => {
  const updatedTierList = [...tierList].map((row) => ({
    ...row,
    tierListSelectedItems: row.tierListSelectedItems.filter(
      (item) => !item?.opacity
    ),
  }));
  return updatedTierList;
};
