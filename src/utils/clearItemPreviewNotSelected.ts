import { TierListItem } from "../pages/TierList";

export const clearItemPreviewNotSelected = (tierListItems: TierListItem[]) => {
  const updatedTierListItems = [...tierListItems].filter(
    (item) => !item?.opacity
  );
  return updatedTierListItems;
};
