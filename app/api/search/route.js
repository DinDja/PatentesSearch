import { proxyUpstream } from "../../../lib/upstream";

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const query = Object.fromEntries(searchParams.entries());

  query.page = String(Math.max(1, parseInt(query.page || "1", 10)));
  query.limit = String(Math.min(100, Math.max(1, parseInt(query.limit || "20", 10))));

  return proxyUpstream("/search", query);
}