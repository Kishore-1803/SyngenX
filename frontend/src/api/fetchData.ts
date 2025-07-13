import API_BASE_URL from "../config";

export async function fetchUserData(token: string) {
  const res = await fetch(`${API_BASE_URL}/data/fetch`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}
