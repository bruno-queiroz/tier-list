import { TierList } from "../pages/CreateTierList";

export const getTierLists = async () => {
  console.log("fetching");
  const response = await fetch("http://localhost:3000/get-tier-lists");
  const data: TierList[] = await response.json();
  return data;
};
