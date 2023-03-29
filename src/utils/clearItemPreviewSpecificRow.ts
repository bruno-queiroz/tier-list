import { TierList } from "../pages/TierList";

export const clearItemPreviewSpecificRow = (
  rowIndex: number,
  tierList: TierList[]
) => {
  if (!rowIndex && rowIndex !== 0) return tierList;

  const updatedTierList = [...tierList];
  updatedTierList[rowIndex].tierListSelectedItems = updatedTierList[
    rowIndex
  ].tierListSelectedItems.filter((item) => !item?.opacity);
  return updatedTierList;
};
