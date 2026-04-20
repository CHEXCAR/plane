/**
 * SmartLinkCard — Jira Smart Link-style URL unfurl card.
 * Fetches metadata from CIRA collector /_cira/link-metadata and renders a preview.
 * CHEXCAR addition (not upstream).
 */
"use client";

import { useEffect, useState } from "react";

type Metadata = {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
  site_name: string | null;
  kind?: string;
};

type Props = {
  url: string;
  layout: "inline" | "block";
};

const CACHE = new Map<string, Metadata | "error" | "loading">();

export function SmartLinkCard({ url, layout }: Props) {
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!url) return;
    const cached = CACHE.get(url);
    if (cached && cached !== "loading") {
      if (cached === "error") setStatus("error");
      else {
        setMeta(cached);
        setStatus("ok");
      }
      return;
    }
    CACHE.set(url, "loading");
    let cancelled = false;
    fetch(`/_cira/link-metadata?url=${encodeURIComponent(url)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Metadata) => {
        if (cancelled) return;
        CACHE.set(url, d);
        setMeta(d);
        setStatus("ok");
      })
      .catch(() => {
        if (cancelled) return;
        CACHE.set(url, "error");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const host = safeHost(url);

  if (status === "loading") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="smart-link smart-link-loading">
        <span className="smart-link-favicon" aria-hidden />
        <span className="smart-link-title">{host}</span>
      </a>
    );
  }

  if (status === "error" || !meta) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="smart-link smart-link-error">
        <span className="smart-link-favicon" aria-hidden />
        <span className="smart-link-title">{url}</span>
      </a>
    );
  }

  if (layout === "inline") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="smart-link smart-link-inline">
        {meta.favicon ? (
          <img src={meta.favicon} alt="" className="smart-link-favicon-img" />
        ) : (
          <span className="smart-link-favicon" aria-hidden />
        )}
        <span className="smart-link-title">{meta.title || host}</span>
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="smart-link smart-link-block">
      <div className="smart-link-body">
        <div className="smart-link-site">
          {meta.favicon ? (
            <img src={meta.favicon} alt="" className="smart-link-favicon-img" />
          ) : (
            <span className="smart-link-favicon" aria-hidden />
          )}
          <span className="smart-link-sitename">{meta.site_name || host}</span>
        </div>
        <div className="smart-link-title">{meta.title || host}</div>
        {meta.description ? <div className="smart-link-desc">{meta.description}</div> : null}
      </div>
      {meta.image ? (
        <div className="smart-link-image">
          <img src={meta.image} alt="" loading="lazy" />
        </div>
      ) : null}
    </a>
  );
}

function safeHost(u: string) {
  try {
    return new URL(u).host;
  } catch {
    return u;
  }
}
