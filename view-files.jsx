// Knowledge base — browse and manage every data source Hermes is grounded in.

const { useState: useStateK } = React;

const KB_SOURCES = [
  { id: "nextcloud", label: "Nextcloud",   sub: "File storage",  icon: "Folder",   count: 1847, status: "active", last: "12m ago", indexed: 1847, total: 1891 },
  { id: "email",     label: "Email",       sub: "fjordlys.no",   icon: "Mail",     count: 342,  status: "active", last: "2m ago",  indexed: 342,  total: 356  },
  { id: "crm",       label: "HubSpot CRM", sub: "Sales data",    icon: "Database", count: 156,  status: "active", last: "5m ago",  indexed: 156,  total: 156  },
  { id: "fiken",     label: "Fiken",       sub: "Accounting",    icon: "Building", count: 89,   status: "active", last: "1h ago",  indexed: 89,   total: 94   },
  { id: "website",   label: "fjordlys.no", sub: "Public site",   icon: "Globe",    count: 47,   status: "active", last: "6h ago",  indexed: 47,   total: 47   },
];

const KB_FOLDERS = [
  { id: "contracts",  name: "Contracts",  items: 14, icon: "Files"    },
  { id: "invoices",   name: "Invoices",   items: 38, icon: "Building" },
  { id: "marketing",  name: "Marketing",  items: 61, icon: "Content"  },
  { id: "products",   name: "Products",   items: 22, icon: "Database" },
  { id: "reports",    name: "Reports",    items: 18, icon: "TrendUp"  },
];

const KB_FILES = [
  { id: "d1", type: "pdf",  name: "Scandic Byporten — kontrakt.pdf",       size: "184 KB", indexed: true,  usedIn: 3,  tags: ["contract", "hotel"],   agents: ["sales", "accounting"] },
  { id: "d2", type: "pdf",  name: "Tromsø-stol produktspesifikasjon.pdf",  size: "2.1 MB", indexed: true,  usedIn: 8,  tags: ["product", "spec"],     agents: ["sales", "marketing", "content"] },
  { id: "d3", type: "docx", name: "Tone of voice guide.docx",              size: "47 KB",  indexed: true,  usedIn: 14, tags: ["brand", "writing"],    agents: ["content", "marketing"] },
  { id: "d4", type: "xlsx", name: "Prisliste 2026.xlsx",                   size: "94 KB",  indexed: true,  usedIn: 5,  tags: ["pricing"],             agents: ["sales", "accounting"] },
  { id: "d5", type: "pdf",  name: "Bergen-bord teknisk tegning.pdf",       size: "8.3 MB", indexed: false, usedIn: 0,  tags: ["product"],             agents: [] },
  { id: "d6", type: "pdf",  name: "Thon Hotels — tilbud.pdf",              size: "112 KB", indexed: true,  usedIn: 2,  tags: ["proposal"],            agents: ["sales"] },
  { id: "d7", type: "docx", name: "Årsrapport 2025 — utkast.docx",        size: "540 KB", indexed: true,  usedIn: 1,  tags: ["finance", "report"],   agents: ["accounting", "research"] },
  { id: "d8", type: "xlsx", name: "Budsjett Q2 2026.xlsx",                 size: "210 KB", indexed: false, usedIn: 0,  tags: ["finance"],             agents: [] },
];

const SOURCE_STATS = {
  email: {
    title: "Email · fjordlys.no",
    sub: "IMAP sync via Dovecot on VPS",
    stats: [{ label: "Indexed", val: "342" }, { label: "Last 7d", val: "31" }, { label: "Unread", val: "14" }],
    items: [
      { label: "Re: Tilbud på stoler — Scandic",   meta: "from: innkjop@scandic.com · 2h ago" },
      { label: "Ny forespørsel fra Tromsø Uni",    meta: "from: kari.nilsen@uit.no · 9h ago" },
      { label: "Faktura #4821 · Posten Bring",     meta: "from: noreply@posten.no · 1d ago" },
      { label: "Svar: Nordic furniture fair 2026", meta: "from: info@nordicdesign.no · 2d ago" },
    ],
  },
  crm: {
    title: "HubSpot CRM",
    sub: "Connected via HubSpot API",
    stats: [{ label: "Contacts", val: "156" }, { label: "Open deals", val: "9" }, { label: "Tasks", val: "12" }],
    items: [
      { label: "Nordlys Hotell AS — score 84",   meta: "stage: Outreach · never contacted" },
      { label: "Bergen Advokatkontor — score 77", meta: "stage: Proposal · 3 days open" },
      { label: "Tromsø Universitet — score 71",  meta: "stage: Discovery · tender May 14" },
      { label: "Scandic Byporten — score 68",    meta: "stage: Outreach · cold" },
    ],
  },
  fiken: {
    title: "Fiken Accounting",
    sub: "Connected via Fiken API",
    stats: [{ label: "Invoices", val: "89" }, { label: "This month", val: "14" }, { label: "Overdue", val: "1" }],
    items: [
      { label: "Faktura #4821 · Scandic Byporten",  meta: "NOK 180 000 · paid" },
      { label: "Faktura #4820 · Bergen Adv.",        meta: "NOK 95 000 · paid" },
      { label: "Faktura #4819 · Thon Hotels",        meta: "NOK 42 000 · pending" },
      { label: "Faktura #4815 · Oslo Dental",        meta: "NOK 18 500 · overdue" },
    ],
  },
  website: {
    title: "fjordlys.no",
    sub: "Crawled every 6 hours",
    stats: [{ label: "Pages", val: "47" }, { label: "Products", val: "23" }, { label: "Updated", val: "6h ago" }],
    items: [
      { label: "/produkter/tromsø-stol",   meta: "product page · NOK 8 900" },
      { label: "/produkter/bergen-bord",   meta: "product page · NOK 14 500" },
      { label: "/om-oss",                  meta: "about page · 320 words" },
      { label: "/kontraktsprogram",        meta: "B2B landing · 580 words" },
    ],
  },
};

function KnowledgeView() {
  const [activeId, setActiveId] = useStateK("nextcloud");
  const [selectedFile, setSelectedFile] = useStateK(null);
  const [query, setQuery] = useStateK("");

  const source = KB_SOURCES.find(s => s.id === activeId);

  return (
    <div className="kb">
      <div className="kb-sources">
        <div className="kb-sources-head">
          <span className="eyebrow">Sources</span>
          <button className="btn sm primary" style={{padding: "2px 8px"}}><Icon.Plus size={11}/></button>
        </div>

        {KB_SOURCES.map(s => {
          const Ic = Icon[s.icon] || Icon.Database;
          return (
            <button
              key={s.id}
              className={"kb-source-item" + (activeId === s.id ? " active" : "")}
              onClick={() => { setActiveId(s.id); setSelectedFile(null); }}
            >
              <div className="kb-source-icon"><Ic size={14}/></div>
              <div className="kb-source-text">
                <div className="kb-source-label">{s.label}</div>
                <div className="kb-source-sub">{s.sub}</div>
              </div>
              <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3}}>
                <span className="kb-source-count">{s.count.toLocaleString()}</span>
                <span className="dot ok" style={{width: 5, height: 5}}></span>
              </div>
            </button>
          );
        })}

        <div className="kb-sources-divider"/>

        <div style={{padding: "0 14px"}}>
          <div className="eyebrow" style={{marginBottom: 8}}>Index health</div>
          {KB_SOURCES.map(s => (
            <div key={s.id} style={{marginBottom: 10}}>
              <div style={{display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 3}}>
                <span style={{color: "var(--text-2)"}}>{s.label}</span>
                <span className="mono" style={{color: "var(--text-3)"}}>{Math.round(s.indexed / s.total * 100)}%</span>
              </div>
              <div className="kb-usage-bar">
                <div className="kb-usage-fill" style={{width: (s.indexed / s.total * 100) + "%", background: "var(--ok)"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="kb-browser">
        <div className="kb-browser-bar">
          <div className="kb-breadcrumb">
            {(() => { const Ic = Icon[source.icon] || Icon.Folder; return <Ic size={14} style={{color: "var(--accent)", flexShrink: 0}}/>; })()}
            <span>{source.label}</span>
            {activeId === "nextcloud" && selectedFile && (
              <>
                <span className="kb-breadcrumb-sep">/</span>
                <span className="kb-breadcrumb-sub">{selectedFile.name}</span>
              </>
            )}
          </div>
          {activeId === "nextcloud" && (
            <input
              className="kb-search"
              placeholder="Search files…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          )}
          <button className="btn sm ghost"><Icon.Refresh size={12}/> Sync</button>
        </div>

        <div className="kb-browser-scroll">
          {activeId === "nextcloud" ? (
            <NextcloudBrowser
              query={query}
              selectedId={selectedFile?.id}
              onSelect={setSelectedFile}
            />
          ) : (
            <SourceStats sourceId={activeId}/>
          )}
        </div>
      </div>

      <div className="kb-detail">
        {selectedFile ? (
          <FileDetail file={selectedFile} onClose={() => setSelectedFile(null)}/>
        ) : (
          <SourceDetail source={source}/>
        )}
      </div>
    </div>
  );
}

function NextcloudBrowser({ query, selectedId, onSelect }) {
  const filteredFiles = query
    ? KB_FILES.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : KB_FILES;

  return (
    <>
      {!query && (
        <>
          <div className="eyebrow" style={{marginBottom: 10}}>Folders</div>
          <div className="kb-file-grid" style={{gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))"}}>
            {KB_FOLDERS.map(f => {
              const Ic = Icon[f.icon] || Icon.Folder;
              return (
                <button key={f.id} className="kb-folder">
                  <div className="kb-folder-icon"><Ic size={20}/></div>
                  <div className="kb-folder-name">{f.name}</div>
                  <div className="kb-folder-count">{f.items} files</div>
                </button>
              );
            })}
          </div>
          <div className="eyebrow" style={{marginBottom: 10, marginTop: 8}}>Recent files</div>
        </>
      )}

      <div className="kb-file-grid">
        {filteredFiles.map(f => (
          <button
            key={f.id}
            className={"kb-file" + (selectedId === f.id ? " selected" : "")}
            onClick={() => onSelect(f)}
          >
            <div className="kb-file-top">
              <div className={"kb-file-icon " + f.type}>{f.type}</div>
            </div>
            <div className="kb-file-body">
              <div className="kb-file-name">{f.name}</div>
              <div className="kb-file-size">{f.size}</div>
              <div className={"kb-file-badge" + (f.indexed ? "" : " pending")}>
                {f.indexed
                  ? <><Icon.Check size={8}/> indexed</>
                  : <><Icon.Clock size={8}/> pending</>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function SourceStats({ sourceId }) {
  const s = SOURCE_STATS[sourceId];
  if (!s) return null;
  return (
    <div className="kb-stats-wrap">
      <div className="kb-stats-card">
        <div className="kb-stats-head">
          <div className="kb-stats-icon">
            {(() => { const src = KB_SOURCES.find(x => x.id === sourceId); const Ic = Icon[src?.icon] || Icon.Database; return <Ic size={16}/>; })()}
          </div>
          <div>
            <div className="kb-stats-title">{s.title}</div>
            <div className="kb-stats-sub">{s.sub}</div>
          </div>
          <span className="dot ok pulse" style={{marginLeft: "auto"}}></span>
        </div>

        <div className="kb-stats-grid">
          {s.stats.map((st, i) => (
            <div key={i} className="kb-stat">
              <div className="eyebrow">{st.label}</div>
              <div className="kb-stat-val">{st.val}</div>
            </div>
          ))}
        </div>

        <div className="kb-items-list">
          <div className="eyebrow" style={{padding: "10px 20px 6px"}}>Recent items</div>
          {s.items.map((item, i) => (
            <div key={i} className="kb-item-row">
              <Icon.Dot size={8} style={{color: "var(--text-3)", flexShrink: 0}}/>
              <div className="kb-item-label">{item.label}</div>
              <div className="kb-item-meta">{item.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileDetail({ file, onClose }) {
  const agentObjects = (file.agents || []).map(id => AGENTS.find(a => a.id === id)).filter(Boolean);
  const usagePct = Math.min(100, Math.round((file.usedIn / 15) * 100));

  return (
    <>
      <div className="kb-detail-head">
        <div className="kb-detail-title">{file.name}</div>
        <button className="btn sm ghost" style={{padding: "2px 6px", flexShrink: 0}} onClick={onClose}>
          <Icon.X size={12}/>
        </button>
      </div>

      <div style={{display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4}}>
        <span className={"kb-file-icon " + file.type} style={{width: 32, height: 32, fontSize: 8}}>{file.type}</span>
        <div>
          <span className={"tag " + (file.indexed ? "ok" : "warn")} style={{fontSize: 9}}>
            {file.indexed ? "Indexed" : "Pending index"}
          </span>
          <div style={{fontSize: 10.5, color: "var(--text-3)", marginTop: 4}}>{file.size}</div>
        </div>
      </div>

      {file.tags.length > 0 && (
        <div className="kb-detail-section">
          <div className="eyebrow" style={{marginBottom: 6}}>Tags</div>
          <div style={{display: "flex", gap: 5, flexWrap: "wrap"}}>
            {file.tags.map(t => <span key={t} className="tag" style={{fontSize: 9}}>{t}</span>)}
          </div>
        </div>
      )}

      <div className="kb-detail-section">
        <div className="eyebrow" style={{marginBottom: 4}}>Usage in conversations</div>
        <div className="kb-usage-row">
          <span style={{fontSize: 11, color: "var(--text-1)"}}>{file.usedIn} times</span>
          <span className="mono" style={{fontSize: 10, color: "var(--text-3)"}}>{usagePct}% of max</span>
        </div>
        <div className="kb-usage-bar">
          <div className="kb-usage-fill" style={{width: usagePct + "%"}}/>
        </div>
      </div>

      {agentObjects.length > 0 ? (
        <div className="kb-detail-section">
          <div className="eyebrow" style={{marginBottom: 8}}>Agents with access</div>
          <div className="kb-agents-row">
            {agentObjects.map(a => (
              <div key={a.id} style={{display: "flex", alignItems: "center", gap: 5}}>
                <AgentAvatar agent={a} size={20}/>
                <span style={{fontSize: 11, color: "var(--text-1)"}}>{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="kb-detail-section">
          <div style={{fontSize: 11, color: "var(--text-3)"}}>No agents have accessed this file yet.</div>
        </div>
      )}

      <div className="kb-action-row">
        <button className="btn sm" style={{flex: 1, justifyContent: "center"}}>
          <Icon.Refresh size={11}/> Re-index
        </button>
        <button className="btn sm ghost" style={{flex: 1, justifyContent: "center"}}>
          <Icon.Download size={11}/> Download
        </button>
      </div>
    </>
  );
}

function SourceDetail({ source }) {
  const Ic = Icon[source.icon] || Icon.Database;
  const pct = Math.round(source.indexed / source.total * 100);
  return (
    <>
      <div className="kb-detail-head">
        <div className="kb-detail-title">{source.label}</div>
        <span className="dot ok pulse" style={{flexShrink: 0}}></span>
      </div>
      <div style={{fontSize: 11, color: "var(--text-2)", marginTop: 2}}>{source.sub}</div>

      <div className="kb-detail-section">
        <div className="eyebrow" style={{marginBottom: 6}}>Index progress</div>
        <div className="kb-usage-row">
          <span style={{fontSize: 11, color: "var(--text-1)"}}>{source.indexed.toLocaleString()} / {source.total.toLocaleString()} docs</span>
          <span className="mono" style={{fontSize: 10, color: "var(--text-3)"}}>{pct}%</span>
        </div>
        <div className="kb-usage-bar" style={{height: 5, marginTop: 6}}>
          <div className="kb-usage-fill" style={{width: pct + "%", background: "var(--ok)"}}/>
        </div>
      </div>

      <div className="kb-detail-section">
        <div className="eyebrow" style={{marginBottom: 6}}>Sync status</div>
        <div style={{display: "flex", alignItems: "center", gap: 6}}>
          <span className="dot ok"></span>
          <span style={{fontSize: 11.5, color: "var(--text-1)"}}>Connected</span>
          <span className="mono" style={{fontSize: 10, color: "var(--text-3)", marginLeft: "auto"}}>last {source.last}</span>
        </div>
      </div>

      <div className="kb-detail-section">
        <div className="eyebrow" style={{marginBottom: 8}}>Agents using this source</div>
        <div className="kb-agents-row">
          {AGENTS.filter(a => a.id !== "hermes").slice(0, 4).map(a => (
            <div key={a.id} style={{display: "flex", alignItems: "center", gap: 5}}>
              <AgentAvatar agent={a} size={20}/>
              <span style={{fontSize: 11, color: "var(--text-1)"}}>{a.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="kb-action-row" style={{marginTop: 16}}>
        <button className="btn sm" style={{flex: 1, justifyContent: "center"}}>
          <Icon.Refresh size={11}/> Sync now
        </button>
        <button className="btn sm ghost" style={{flex: 1, justifyContent: "center"}}>
          <Icon.Settings size={11}/> Configure
        </button>
      </div>
    </>
  );
}

Object.assign(window, { KnowledgeView });
