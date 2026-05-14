"use client";

import { useEffect, useRef, useState } from "react";

const initialMeta = {
    total: 0,
    page: 1,
    pages: 1,
    limit: 20
};

function toQuery(params) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;
        const text = String(value).trim();
        if (!text) continue;
        qs.set(key, text);
    }
    return qs.toString();
}

async function apiGet(path, params) {
    const query = params ? `?${toQuery(params)}` : "";
    const response = await fetch(`/api${path}${query}`);
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Erro ${response.status}: ${body || response.statusText}`);
    }
    return response.json();
}

function formatValue(value) {
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object" && value !== null) return JSON.stringify(value);
    return String(value ?? "");
}

export default function PatentSearchClient() {
    const dialogRef = useRef(null);
    const [healthText, setHealthText] = useState("Verificando API...");
    const [healthState, setHealthState] = useState("");
    const [statusText, setStatusText] = useState("Faça uma busca para começar.");
    const [resultsState, setResultsState] = useState("empty");
    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState(initialMeta);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        q: "",
        numero: "",
        titulo: "",
        depositante: "",
        ipc: "",
        limit: "20"
    });
    const [lastQuery, setLastQuery] = useState({});
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");
    const [detailTitle, setDetailTitle] = useState("Detalhes da patente");
    const [detailData, setDetailData] = useState(null);

    useEffect(() => {
        const loadHealth = async () => {
            try {
                const health = await apiGet("/health");
                const loaded = health?.loaded ?? health?.ok ?? "ok";
                setHealthState("ok");
                setHealthText(`API online (${loaded})`);
            } catch {
                setHealthState("error");
                setHealthText("API indisponivel");
            }
        };

        loadHealth();
    }, []);

    const runSearch = async (nextPage = 1, nextQuery = lastQuery) => {
        setPage(nextPage);
        setResultsState("loading");
        setStatusText("Buscando patentes...");

        try {
            const limit = Number(filters.limit) || 20;
            const data = await apiGet("/search", {
                ...nextQuery,
                page: nextPage,
                limit
            });

            const nextItems = Array.isArray(data.items) ? data.items : [];
            const nextMeta = {
                total: Number(data.total || 0),
                page: Number(data.page || nextPage),
                pages: Number(data.pages || 1),
                limit: Number(data.limit || limit)
            };

            setItems(nextItems);
            setMeta(nextMeta);

            if (nextMeta.total === 0) {
                setResultsState("empty");
                setStatusText("Nenhum resultado.");
                return;
            }

            setResultsState("ready");
            setStatusText(`${nextMeta.total.toLocaleString("pt-BR")} resultado(s)`);
        } catch (error) {
            setResultsState("error");
            setStatusText("Erro na consulta.");
            setItems([]);
            setMeta(initialMeta);
            console.error(error);
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const query = {
            q: filters.q,
            numero: filters.numero,
            titulo: filters.titulo,
            depositante: filters.depositante,
            ipc: filters.ipc
        };
        setLastQuery(query);
        runSearch(1, query);
    };

    const openDetail = async (numero) => {
        if (!numero) return;
        setDetailTitle(`Patente ${numero}`);
        setDetailLoading(true);
        setDetailError("");
        setDetailData(null);
        dialogRef.current?.showModal();

        try {
            const data = await apiGet(`/patents/${encodeURIComponent(numero)}`);
            setDetailData(data);
        } catch (error) {
            setDetailError(error.message || "Falha ao carregar detalhes.");
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <>
            <div className="bg-grid" />
            <header className="topbar">
                <div className="brand">
                    <span className="brand-dot" />
                    <h1>Buscador de Patentes</h1>
                </div>
                <div className={`health ${healthState}`} aria-live="polite">
                    {healthText}
                </div>
            </header>

            <main className="layout">
                <section className="hero">
                    <p className="kicker">BUSCA INTELIGENTE</p>
                    <h2>    Consulte numero, titulo, depositante e IPC com paginacao rapida e acesso ao registro
                        completo.</h2>
                </section>

                <section className="search-panel" aria-label="Filtros de busca">
                    <form id="searchForm" className="filters" onSubmit={onSubmit}>
                        <label>
                            Termo livre
                            <input
                                type="text"
                                name="q"
                                placeholder="Ex.: energia, IA, PETROBRAS"
                                value={filters.q}
                                onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
                            />
                        </label>
                        <label>
                            Numero
                            <input
                                type="text"
                                name="numero"
                                placeholder="Ex.: BR 10 2024 001998 9"
                                value={filters.numero}
                                onChange={(e) => setFilters((prev) => ({ ...prev, numero: e.target.value }))}
                            />
                        </label>
                        <label>
                            Titulo
                            <input
                                type="text"
                                name="titulo"
                                placeholder="Parte do titulo"
                                value={filters.titulo}
                                onChange={(e) => setFilters((prev) => ({ ...prev, titulo: e.target.value }))}
                            />
                        </label>
                        <label>
                            Depositante
                            <input
                                type="text"
                                name="depositante"
                                placeholder="Ex.: PETROBRAS"
                                value={filters.depositante}
                                onChange={(e) => setFilters((prev) => ({ ...prev, depositante: e.target.value }))}
                            />
                        </label>
                        <label>
                            IPC
                            <input
                                type="text"
                                name="ipc"
                                placeholder="Ex.: G06"
                                value={filters.ipc}
                                onChange={(e) => setFilters((prev) => ({ ...prev, ipc: e.target.value }))}
                            />
                        </label>
                        <label>
                            Limite por pagina
                            <select
                                name="limit"
                                value={filters.limit}
                                onChange={(e) => setFilters((prev) => ({ ...prev, limit: e.target.value }))}
                            >
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </label>
                        <button type="submit" className="btn-primary">
                            Buscar
                        </button>
                    </form>
                </section>

                <section className="results-head">
                    <div>{statusText}</div>
                    {resultsState === "ready" ? (
                        <div className="pager">
                            <button
                                className="btn-secondary"
                                type="button"
                                disabled={meta.page <= 1}
                                onClick={() => runSearch(Math.max(1, page - 1))}
                            >
                                Anterior
                            </button>
                            <span>{`Pagina ${meta.page} de ${meta.pages}`}</span>
                            <button
                                className="btn-secondary"
                                type="button"
                                disabled={meta.page >= meta.pages}
                                onClick={() => runSearch(page + 1)}
                            >
                                Proxima
                            </button>
                        </div>
                    ) : null}
                </section>

                <section className="results" aria-live="polite">
                    {resultsState === "loading" ? <div className="loading">Buscando patentes...</div> : null}
                    {resultsState === "empty" ? <div className="empty">Nenhum resultado encontrado.</div> : null}
                    {resultsState === "error" ? (
                        <div className="error">Falha ao buscar patentes. Verifique API e credenciais.</div>
                    ) : null}
                    {resultsState === "ready"
                        ? items.map((item) => (
                            <article className="card" key={`${item.numero}-${item.titulo}`}>
                                <h3>{item.titulo || "Sem titulo"}</h3>
                                <div className="card-meta">
                                    <span className="badge">{item.numero || "Sem numero"}</span>
                                    <span>{`Depositante: ${item.depositante || "Nao informado"}`}</span>
                                    <span>{`IPC: ${item.ipc || "Nao informado"}`}</span>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="btn-secondary"
                                        type="button"
                                        onClick={() => openDetail(item.numero)}
                                    >
                                        Ver detalhes
                                    </button>
                                </div>
                            </article>
                        ))
                        : null}
                </section>
            </main>

            <dialog className="details-dialog" ref={dialogRef}>
                <article>
                    <header>
                        <h3>{detailTitle}</h3>
                        <button className="btn-close" type="button" onClick={() => dialogRef.current?.close()}>
                            x
                        </button>
                    </header>
                    <div className="detail-body">
                        {detailLoading ? <div className="loading">Carregando detalhes...</div> : null}
                        {detailError ? <div className="error">{detailError}</div> : null}
                        {!detailLoading && !detailError && detailData ? (
                            <div className="detail-list">
                                {Object.entries(detailData).map(([key, value]) => (
                                    <div className="detail-item" key={key}>
                                        <div className="detail-key">{key}</div>
                                        <div>{formatValue(value)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </article>
            </dialog>
        </>
    );
}