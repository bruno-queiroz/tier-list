import { TierListFormData } from "../pages/CreateTierList";
import { apiBaseUrl } from "./apiConfig";

export const postTierList = async (tierList: TierListFormData) => {
  const response = await fetch(`${apiBaseUrl}/create-tier-list`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(tierList),
  });
  const data = await response.json();
  return data;
};
