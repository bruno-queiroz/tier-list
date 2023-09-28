import { TierList } from "../pages/TierList";
import { apiBaseUrl } from "./apiConfig";

export const patchTierList = async (
  tierListID: string,
  tierList: TierList[]
) => {
  const response = await fetch(`${apiBaseUrl}/tier-list/${tierListID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tierList),
  });
  const data = await response.json();
  return data;
};
