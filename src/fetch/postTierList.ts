import { TierListFormData } from "../pages/CreateTierList";

export const postTierList = async (tierList: FormData) => {
  const response = await fetch("http://localhost:3000/create-tier-list", {
    method: "POST",
    body: tierList,
  });
  const data = await response.json();
  return data;
};
