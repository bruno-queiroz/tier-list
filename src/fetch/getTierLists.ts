import { TierListFormData } from "../pages/CreateTierList";

export type TierList = TierListFormData & { _id: string };

export const getTierLists = async () => {
  const response = await fetch("http://localhost:3000/get-tier-lists");
  const data: TierList[] = await response.json();
  return data;
};
