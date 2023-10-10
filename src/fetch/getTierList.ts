import { TierListFormData } from "../pages/CreateTierList";
import { apiBaseUrl } from "./apiConfig";

type TierListData = TierListFormData & {
  _id: string;
};

type TierListResponse = {
  data: TierListData;
  msg: string;
  isOk: boolean;
};

export const getTierList = async (tierListID: string) => {
  const response = await fetch(`${apiBaseUrl}/tier-list/${tierListID}`);
  const data: TierListResponse = await response.json();
  return data;
};
