import { apiBaseUrl } from "./apiConfig";
import { TierListResponse } from "./getTierLists";

export const getTierList = async (tierListID: string) => {
  const response = await fetch(`${apiBaseUrl}/get-tier-list/${tierListID}`);
  const data: TierListResponse = await response.json();
  return data;
};
