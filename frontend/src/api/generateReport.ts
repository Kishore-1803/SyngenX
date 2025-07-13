import API_BASE_URL from "../config";

export async function generateReport(token: string): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/report/generate`, {
    method: "POST", // ✅ Add this line
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Report generation failed");
  return await res.blob();
}

