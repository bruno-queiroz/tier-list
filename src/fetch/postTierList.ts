import { apiBaseUrl } from "./apiConfig";

export const postTierList = async (tierList: FormData) => {
  const response = await fetch(`${apiBaseUrl}/create-tier-list`, {
    method: "POST",
    body: tierList,
  });
  const data = await response.json();
  return data;
};
