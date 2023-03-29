import { TierListItem } from "../pages/TierList";

export const patchTierListItems = async (
  tierListID: string,
  tierListItems: TierListItem[]
) => {
  const response = fetch(
    `http://localhost:3000/update-tier-list-items/${tierListID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tierListItems),
    }
  );
};