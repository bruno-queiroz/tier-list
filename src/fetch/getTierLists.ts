import { TierListFormData } from "../pages/CreateTierList";
import { apiBaseUrl } from "./apiConfig";

export type TierListResponse = TierListFormData & { _id: string };

export const getTierLists = async () => {
  const response = await fetch(`${apiBaseUrl}/get-tier-lists`);
  const data: TierListResponse[] = await response.json();
  return data;
};
