export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiResponse(path, options = {}) {
  const { body, headers, ...requestOptions } = options;
  const response = await fetch(path, {
    credentials: "same-origin",
    ...requestOptions,
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError(
      data?.message || response.statusText || "Request failed",
      response.status,
      data
    );
  }

  return { data, status: response.status };
}

export async function apiRequest(path, options = {}) {
  const response = await apiResponse(path, options);
  return response.data;
}
