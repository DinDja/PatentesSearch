import * as cheerio from "cheerio";
import JSZip from "jszip";

import { proxyUpstream } from "../../../../lib/upstream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INPI_HOST_PATTERN = /(^|\.)inpi\.gov\.br$/i;
const INPI_USER_AGENT =
  "Mozilla/5.0 (compatible; BrunoPatentes/1.0; +https://www.gov.br/inpi)";

const PROGRAM_FIELD_MAP = {
  Cd: "despacho_codigo",
  Np: "numero_processo",
  "54": "titulo",
  "73": "titular",
  Cr: "autor",
  Lg: "linguagem",
  Cp: "campo_aplicacao",
  Tp: "tipo_programa",
  Dl: "data_criacao"
};

function normalizeProcessNumber(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function joinText(current, next) {
  if (!next) return current || "";
  if (!current) return next;
  return `${current} ${next}`.trim();
}

function cleanText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureInpiUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("URL oficial invalida.");
  }

  if (!INPI_HOST_PATTERN.test(parsed.hostname)) {
    throw new Error("URL oficial fora do dominio do INPI.");
  }

  return parsed.toString();
}

async function readProxyJson(path, query = {}) {
  const response = await proxyUpstream(path, query);
  const text = await response.text();

  try {
    return { ok: response.ok, status: response.status, data: JSON.parse(text) };
  } catch {
    return { ok: response.ok, status: response.status, data: null };
  }
}

async function findIndexedItem(numero, tipoHint) {
  const query = {
    numero,
    limit: 8
  };
  if (tipoHint) query.tipo = tipoHint;

  const result = await readProxyJson("/search", query);
  const items = Array.isArray(result?.data?.items)
    ? result.data.items
    : Array.isArray(result?.data?.data)
      ? result.data.data
      : [];

  if (!items.length) return null;

  const normalizedTarget = normalizeProcessNumber(numero);
  const exact = items.find(
    (item) => normalizeProcessNumber(item?.numero || item?.numero_processo) === normalizedTarget
  );

  return exact || items[0] || null;
}

function parsePatentHtml(html) {
  const $ = cheerio.load(html);
  const fields = {};

  $("table tr").each((_, row) => {
    const cells = $(row)
      .find("th, td")
      .map((__, cell) => cleanText($(cell).text()))
      .get()
      .filter(Boolean);

    if (cells.length < 2) return;
    const key = cells[0].replace(/:$/, "");
    const value = cells.slice(1).join(" | ");

    if (!key || !value) return;
    fields[key] = value;
  });

  if (!Object.keys(fields).length) {
    $("dl dt").each((_, dt) => {
      const key = cleanText($(dt).text()).replace(/:$/, "");
      const value = cleanText($(dt).next("dd").text());
      if (key && value) fields[key] = value;
    });
  }

  const title =
    cleanText($("h1").first().text()) ||
    cleanText($("h2").first().text()) ||
    cleanText($("title").first().text()) ||
    null;

  return {
    title,
    fields
  };
}

async function fetchPatentDetailsFromInpi(url, numero, indexedItem) {
  const inpiUrl = ensureInpiUrl(url);
  const response = await fetch(inpiUrl, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "User-Agent": INPI_USER_AGENT
    }
  });

  if (!response.ok) {
    throw new Error(`INPI retornou status ${response.status} para o detalhe da patente.`);
  }

  const html = await response.text();
  const parsed = parsePatentHtml(html);

  return {
    ...indexedItem,
    numero_processo: indexedItem?.numero || numero,
    titulo: indexedItem?.titulo || parsed.title || null,
    tipo: indexedItem?.tipo || "patente",
    fonte: "INPI",
    url_oficial: inpiUrl,
    consultado_em: new Date().toISOString(),
    detalhes_oficiais: parsed.fields
  };
}

function mapProgramRecord(record) {
  const mapped = {};
  for (const [tag, value] of Object.entries(record)) {
    const targetKey = PROGRAM_FIELD_MAP[tag] || `tag_${String(tag).toLowerCase()}`;
    mapped[targetKey] = value;
  }
  return mapped;
}

function parseProgramRecordFromText(txt, numero) {
  const target = normalizeProcessNumber(numero);
  const lines = String(txt || "").split(/\r?\n/);

  const records = [];
  let current = {};
  let currentTag = null;

  const flush = () => {
    if (Object.keys(current).length > 0) {
      records.push(current);
      current = {};
      currentTag = null;
    }
  };

  for (const rawLine of lines) {
    const line = String(rawLine || "").trim();
    if (!line) continue;

    const match = line.match(/^\(([A-Za-z0-9]{1,2})\)\s*(.*)$/);
    if (match) {
      const tag = match[1];
      const value = cleanText(match[2]);

      if (tag === "Cd") {
        flush();
      }

      currentTag = tag;
      current[tag] = joinText(current[tag], value);
      continue;
    }

    if (currentTag) {
      current[currentTag] = joinText(current[currentTag], cleanText(line));
    }
  }

  flush();

  const exact = records.find((record) => normalizeProcessNumber(record.Np) === target);
  return exact ? mapProgramRecord(exact) : null;
}

async function fetchProgramDetailsFromInpi(zipUrl, numero, indexedItem) {
  const officialZipUrl = ensureInpiUrl(zipUrl);
  const response = await fetch(officialZipUrl, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/zip,application/octet-stream,*/*",
      "User-Agent": INPI_USER_AGENT
    }
  });

  if (!response.ok) {
    throw new Error(`INPI retornou status ${response.status} para o arquivo de programas.`);
  }

  const zipBuffer = await response.arrayBuffer();
  const zip = await JSZip.loadAsync(zipBuffer);

  const txtEntry = Object.values(zip.files).find(
    (file) => !file.dir && file.name.toLowerCase().endsWith(".txt")
  );

  if (!txtEntry) {
    throw new Error("Arquivo TXT oficial nao encontrado no ZIP da revista.");
  }

  const txt = await txtEntry.async("string");
  const details = parseProgramRecordFromText(txt, numero);

  if (!details) {
    throw new Error("Processo de programa nao localizado no arquivo oficial da revista.");
  }

  return {
    ...indexedItem,
    ...details,
    numero_processo: details.numero_processo || indexedItem?.numero || numero,
    titulo: details.titulo || indexedItem?.titulo || null,
    tipo: "programa",
    fonte: "INPI",
    url_oficial: officialZipUrl,
    arquivo_oficial: txtEntry.name,
    consultado_em: new Date().toISOString()
  };
}

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const rawNumero = resolvedParams?.numero;

  if (!rawNumero) {
    return Response.json(
      { error: "Parametro numero obrigatorio" },
      { status: 400, headers: { "cache-control": "no-store" } }
    );
  }

  const numero = String(rawNumero).trim();
  const tipoHint = String(request.nextUrl.searchParams.get("tipo") || "")
    .trim()
    .toLowerCase();
  const detailUrlHint = String(request.nextUrl.searchParams.get("url_detalhe") || "").trim();
  const zipUrlHint = String(request.nextUrl.searchParams.get("fonte_zip_url") || "").trim();

  const indexedItem = await findIndexedItem(numero, tipoHint || undefined);

  const tipo = String(tipoHint || indexedItem?.tipo || "patente").toLowerCase();
  const detailUrl = detailUrlHint || indexedItem?.url_detalhe;
  const zipUrl = zipUrlHint || indexedItem?.fonte_zip_url;

  try {
    const payload =
      tipo === "programa"
        ? await fetchProgramDetailsFromInpi(zipUrl, numero, indexedItem)
        : await fetchPatentDetailsFromInpi(detailUrl, numero, indexedItem);

    return Response.json(payload, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const fallback = await proxyUpstream(`/patents/${encodeURIComponent(numero)}`);
    const fallbackText = await fallback.text();

    try {
      const fallbackData = JSON.parse(fallbackText);
      return Response.json(
        {
          ...fallbackData,
          numero_processo: fallbackData?.numero_processo || fallbackData?.numero || numero,
          tipo: fallbackData?.tipo || tipo,
          fonte: "UPSTREAM_FALLBACK",
          url_oficial: detailUrl || zipUrl || null,
          erro_consulta_inpi: error.message
        },
        { headers: { "cache-control": "no-store" } }
      );
    } catch {
      return Response.json(
        {
          error: "Falha ao consultar detalhes diretamente no INPI.",
          details: error.message,
          numero_processo: numero,
          tipo,
          url_oficial: detailUrl || zipUrl || null
        },
        { status: 502, headers: { "cache-control": "no-store" } }
      );
    }
  }
}