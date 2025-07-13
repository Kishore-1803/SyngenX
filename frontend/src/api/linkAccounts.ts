import API_BASE_URL from "../config";

/**
 * Initiates account linking with a third-party provider (e.g., GitHub).
 * Sends a POST request to the backend with the provider name and token.
 * 
 * @param provider The name of the provider (e.g., "github")
 * @param token The user's JWT access token
 * @returns A URL string to redirect the user to complete linking
 */
export async function linkAccount(provider: string, token: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/link/${provider}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` // for user verification
    },
    body: JSON.stringify({
      access_token: "github-oauth-access-token" // This is the token for the linked account
    })
  });

  if (!res.ok) throw new Error("Linking failed");
  const data = await res.json();
  return data.auth_url ?? data.message;
}


/**
 * Checks which third-party accounts the user has already linked.
 * 
 * @param token The user's JWT access token
 * @returns A list or status object from the backend
 */
export async function checkLinkedAccounts(token: string) {
  const res = await fetch(`${API_BASE_URL}/link/status`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Check failed:", errorText);
    throw new Error("Check failed");
  }

  return res.json();
}
