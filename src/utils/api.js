const BASE_URL = import.meta.env.VITE_API_URL; 

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null,
) {
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || "Something went wrong");
  }

  return json;
}
