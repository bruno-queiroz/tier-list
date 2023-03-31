import { TierList } from "../pages/TierList";

export const patchTierList = async (
  tierListID: string,
  tierList: TierList[]
) => {
  const response = await fetch(
    `http://localhost:3000/update-tier-list/${tierListID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tierList),
    }
  );
  const data = await response.json();
  return data;
};
