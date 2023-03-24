import { TierListFormData } from "../pages/CreateTierList";

export const postTierList = async (tierList: TierListFormData) => {
  const response = await fetch("http://localhost:3000/create-tier-list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tierList),
  });
  const data = await response.json();
  return data;
};
