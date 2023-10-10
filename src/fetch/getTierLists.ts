import { TierListFormData } from "../pages/CreateTierList";
import { apiBaseUrl } from "./apiConfig";

type TierListData = TierListFormData & {
  _id: string;
};

export type TierListResponse = {
  data: TierListData[];
  msg: string;
  isOk: boolean;
};

export const getTierLists = async () => {
  const response = await fetch(`${apiBaseUrl}/tier-list`);
  const data: TierListResponse = await response.json();
  return data;
};
