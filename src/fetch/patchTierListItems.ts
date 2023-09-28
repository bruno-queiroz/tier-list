import { TierListItem } from "../pages/TierList";
import { apiBaseUrl } from "./apiConfig";

export const patchTierListItems = async (
  tierListID: string,
  tierListItems: TierListItem[]
) => {
  const response = await fetch(`${apiBaseUrl}/tier-list-items/${tierListID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tierListItems),
  });

  const data = await response.json();
  return data;
};
