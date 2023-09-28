import { TierListFormData } from "../pages/CreateTierList";
import { apiBaseUrl } from "./apiConfig";

interface PostTierListResponse {
  msg: string;
  isOk: boolean;
}

export const postTierList = async (tierList: TierListFormData) => {
  const response = await fetch(`${apiBaseUrl}/tier-list`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(tierList),
  });
  const data: PostTierListResponse = await response.json();
  return data;
};
