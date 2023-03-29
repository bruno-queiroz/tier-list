import { TierListFormData } from "../pages/CreateTierList";

export type TierListResponse = TierListFormData & { _id: string };

export const getTierLists = async () => {
  const response = await fetch("http://localhost:3000/get-tier-lists");
  const data: TierListResponse[] = await response.json();
  return data;
};
