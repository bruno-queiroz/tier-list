import { TierListResponse } from "./getTierLists";

export const getTierList = async (tierListID: string) => {
  const response = await fetch(
    `http://localhost:3000/get-tier-list/${tierListID}`
  );
  const data: TierListResponse = await response.json();
  return data;
};
