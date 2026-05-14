const DEFAULT_UPSTREAM_BASE = "https://inpi-rho.vercel.app/api";

function buildHeaders() {
  const headers = {
    Accept: "application/json"
  };

  if (process.env.UPSTREAM_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${process.env.UPSTREAM_BEARER_TOKEN}`;
  }

  if (process.env.UPSTREAM_VERCEL_BYPASS) {
    headers["x-vercel-protection-bypass"] = process.env.UPSTREAM_VERCEL_BYPASS;
  }

  if (process.env.UPSTREAM_CUSTOM_HEADER_NAME && process.env.UPSTREAM_CUSTOM_HEADER_VALUE) {
    headers[process.env.UPSTREAM_CUSTOM_HEADER_NAME] = process.env.UPSTREAM_CUSTOM_HEADER_VALUE;
  }

  return headers;
}

export async function proxyUpstream(path, query = {}) {
  const upstreamBase = process.env.UPSTREAM_BASE || DEFAULT_UPSTREAM_BASE;
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const entry of value) qs.append(key, String(entry));
    } else {
      qs.set(key, String(value));
    }
  }

  const queryString = qs.toString();
  const url = `${upstreamBase}${path}${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: buildHeaders(),
      cache: "no-store"
    });

    const body = await response.text();
    return new Response(body, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json; charset=utf-8",
        "cache-control": "s-maxage=30, stale-while-revalidate=120"
      }
    });
  } catch (error) {
    return Response.json(
      {
        error: "Falha ao conectar com a API upstream",
        details: error.message
      },
      { status: 502 }
    );
  }
}