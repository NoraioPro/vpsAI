// Security center — VPN, audit log, access control.

const { useState: useStateSec } = React;

const SEC_TABS = [
  { id: "overview", label: "Overview",       icon: "Shield"   },
  { id: "vpn",      label: "VPN",            icon: "VPN"      },
  { id: "audit",    label: "Audit log",      icon: "Clock"    },
  { id: "access",   label: "Access control", icon: "Lock"     },
];

const SEC_EVENTS = [
  { id: 1, t: "09:41", level: "info", msg: "WireGuard peer connected",           detail: "Erik Magnusson · 185.102.x.x" },
  { id: 2, t: "09:38", level: "warn", msg: "Agent tool gated — awaiting approval", detail: "Artemis · email.send" },
  { id: 3, t: "09:22", level: "info", msg: "Backup snapshot completed",           detail: "47.2 GB → Hetzner Object Store" },
  { id: 4, t: "09:15", level: "info", msg: "TLS cert auto-renewed",               detail: "hermes.fjordlys.no · Let's Encrypt" },
  { id: 5, t: "08:58", level: "warn", msg: "Fiken API rate limit at 80%",         detail: "Midas · 240/300 req/min" },
  { id: 6, t: "08:44", level: "info", msg: "n8n workflow triggered",              detail: "Lead Nurture Pipeline · 184 runs" },
  { id: 7, t: "08:31", level: "ok",   msg: "All containers healthy",              detail: "8/8 running · 14d 6h uptime" },
  { id: 8, t: "07:55", level: "warn", msg: "Unusual login time",                  detail: "Thomas Haugen · 02:14 UTC" },
];

const VPN_PEERS = [
  { name: "Ingrid Solberg",  device: "MacBook Pro",   ip: "10.0.0.2",  status: "connected", last: "now",    rx: "14.2 MB", tx: "2.8 MB"  },
  { name: "Erik Magnusson",  device: "iPhone 15",     ip: "10.0.0.3",  status: "connected", last: "2m ago", rx: "4.1 MB",  tx: "0.6 MB"  },
  { name: "Sofia Lindqvist", device: "Windows 11",    ip: "10.0.0.4",  status: "connected", last: "8m ago", rx: "22.4 MB", tx: "5.1 MB"  },
  { name: "Thomas Haugen",   device: "Android",       ip: "10.0.0.5",  status: "idle",      last: "6h ago", rx: "1.2 MB",  tx: "0.2 MB"  },
  { name: "hermes-api",      device: "VPS container", ip: "10.0.0.10", status: "connected", last: "now",    rx: "182 MB",  tx: "94 MB"   },
];

const AUDIT_ROWS = [
  { t: "09:42", actor: "Artemis",  kind: "agent",  verb: "drafted",     resource: "email → Nordlys Hotell AS",         outcome: "pending" },
  { t: "09:38", actor: "Hermes",   kind: "agent",  verb: "routed",      resource: "lead → Artemis",                    outcome: "ok"      },
  { t: "09:35", actor: "Atlas",    kind: "agent",  verb: "proposed",    resource: "Q2 Instagram campaign",             outcome: "pending" },
  { t: "09:31", actor: "Iris",     kind: "agent",  verb: "replied",     resource: "ticket #4821",                      outcome: "ok"      },
  { t: "09:27", actor: "Calliope", kind: "agent",  verb: "drafted",     resource: "blog: Nordisk design",              outcome: "pending" },
  { t: "09:22", actor: "system",   kind: "system", verb: "backup",      resource: "snapshot → Hetzner Object Store",   outcome: "ok"      },
  { t: "09:18", actor: "Athena",   kind: "agent",  verb: "completed",   resource: "competitor report",                 outcome: "ok"      },
  { t: "09:15", actor: "system",   kind: "system", verb: "cert-renew",  resource: "hermes.fjordlys.no TLS",            outcome: "ok"      },
  { t: "09:14", actor: "Midas",    kind: "agent",  verb: "categorized", resource: "14 Fiken invoices",                 outcome: "ok"      },
  { t: "09:02", actor: "Hermes",   kind: "agent",  verb: "delegated",   resource: "content planning → Calliope",       outcome: "ok"      },
  { t: "08:58", actor: "system",   kind: "system", verb: "rate-limit",  resource: "Fiken API · 80% cap",               outcome: "warn"    },
  { t: "08:47", actor: "Apollo",   kind: "agent",  verb: "paused",      resource: "Google Ads: Vinterkolleksjon",      outcome: "warn"    },
];

const PERM_COLS = ["read", "write", "email.send", "publish", "pay/invoice", "ads.adjust"];
const PERM_DATA = {
  hermes:     ["allow", "allow", "gate",  "gate",  "gate",  "gate"  ],
  marketing:  ["allow", "none",  "none",  "gate",  "none",  "none"  ],
  sales:      ["allow", "allow", "gate",  "none",  "none",  "none"  ],
  content:    ["allow", "allow", "none",  "gate",  "none",  "none"  ],
  research:   ["allow", "none",  "none",  "none",  "none",  "none"  ],
  accounting: ["allow", "allow", "none",  "none",  "gate",  "none"  ],
  ads:        ["allow", "none",  "none",  "none",  "none",  "gate"  ],
  support:    ["allow", "allow", "gate",  "none",  "none",  "none"  ],
};

function SecurityView() {
  const [tab, setTab] = useStateSec("overview");

  return (
    <div className="sec">
      <div className="sec-nav">
        <div className="eyebrow" style={{padding: "0 16px 14px"}}>Security</div>
        {SEC_TABS.map(t => {
          const Ic = Icon[t.icon] || Icon.Shield;
          return (
            <button
              key={t.id}
              className={"sec-nav-item" + (tab === t.id ? " active" : "")}
              onClick={() => setTab(t.id)}
            >
              <Ic size={14}/>
              <span>{t.label}</span>
              {tab === t.id && <span className="sb-active-bar"/>}
            </button>
          );
        })}
      </div>

      <div className="sec-body">
        {tab === "overview" && <OverviewTab/>}
        {tab === "vpn"      && <VpnTab/>}
        {tab === "audit"    && <AuditLogTab/>}
        {tab === "access"   && <AccessControlTab/>}
      </div>
    </div>
  );
}

function OverviewTab() {
  const warnCount = SEC_EVENTS.filter(e => e.level === "warn").length;
  const sparkData = [1,0,2,1,3,1,2,0,1,2,3,2,1,warnCount];

  return (
    <div className="sec-pane">
      <div className="sec-pane-head">
        <h2>Security overview</h2>
        <div className="sec-pane-sub">All access is gated via WireGuard VPN. Traefik enforces TLS on every endpoint.</div>
      </div>

      <div className="sec-cards">
        <div className="sec-status-card">
          <div className="sec-status-card-head">
            <div className="sec-status-icon" style={{background: "color-mix(in oklab, var(--ok) 12%, var(--bg-2))", border: "1px solid color-mix(in oklab, var(--ok) 28%, var(--bg-2))", color: "var(--ok)"}}>
              <Icon.VPN size={16}/>
            </div>
            <span className="dot ok pulse"/>
          </div>
          <div>
            <div className="sec-status-val">14</div>
            <div className="sec-status-sub">WireGuard peers · all connected</div>
          </div>
          <div style={{fontSize: 10.5, color: "var(--text-3)", fontFamily: "var(--font-mono)"}}>interface wg0 · {TENANT.vpsHost}</div>
        </div>

        <div className="sec-status-card">
          <div className="sec-status-card-head">
            <div className="sec-status-icon" style={{background: "color-mix(in oklab, var(--ok) 12%, var(--bg-2))", border: "1px solid color-mix(in oklab, var(--ok) 28%, var(--bg-2))", color: "var(--ok)"}}>
              <Icon.Shield size={16}/>
            </div>
            <span className="tag ok" style={{fontSize: 9}}>auto-renew</span>
          </div>
          <div>
            <div className="sec-status-val">TLS</div>
            <div className="sec-status-sub">Traefik · Let's Encrypt · all services</div>
          </div>
          <div style={{fontSize: 10.5, color: "var(--text-3)", fontFamily: "var(--font-mono)"}}>next renewal · 87d</div>
        </div>

        <div className="sec-status-card">
          <div className="sec-status-card-head">
            <div className="sec-status-icon" style={{background: "color-mix(in oklab, var(--accent) 12%, var(--bg-2))", border: "1px solid color-mix(in oklab, var(--accent) 28%, var(--bg-2))", color: "var(--accent)"}}>
              <Icon.Lock size={16}/>
            </div>
            <span className="dot ok"/>
          </div>
          <div>
            <div className="sec-status-val">1h ago</div>
            <div className="sec-status-sub">Last encrypted backup</div>
          </div>
          <div style={{fontSize: 10.5, color: "var(--text-3)", fontFamily: "var(--font-mono)"}}>47.2 GB · Hetzner Object Store</div>
        </div>
      </div>

      <div className="sec-section">
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12}}>
          <div className="eyebrow">Security events today · {SEC_EVENTS.length}</div>
          <div style={{display: "flex", alignItems: "center", gap: 8}}>
            <span style={{fontSize: 10.5, color: "var(--warn)"}}>{warnCount} warnings</span>
            <Sparkline data={sparkData} color="var(--warn)" w={80} h={24} fill={false}/>
          </div>
        </div>
        <div className="sec-event-list">
          {SEC_EVENTS.map(e => (
            <div key={e.id} className="sec-event-row">
              <span className="sec-event-time">{e.t}</span>
              <span className={"sec-event-dot " + e.level}/>
              <div className="sec-event-body">
                <div className="sec-event-msg">{e.msg}</div>
                <div className="sec-event-detail">{e.detail}</div>
              </div>
              {e.level === "warn" && <span className="tag warn" style={{fontSize: 9, flexShrink: 0}}>warn</span>}
              {e.level === "ok"   && <span className="tag ok"   style={{fontSize: 9, flexShrink: 0}}>ok</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VpnTab() {
  const connected = VPN_PEERS.filter(p => p.status === "connected").length;

  return (
    <div className="sec-pane">
      <div className="sec-pane-head">
        <h2>WireGuard VPN</h2>
        <div className="sec-pane-sub">All access to Hermes routes through the VPN. No service is exposed without a valid WireGuard key.</div>
      </div>

      <div className="sec-vpn-header">
        <div className="sec-vpn-icon"><Icon.VPN size={18}/></div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 13.5, color: "var(--text-0)", fontWeight: 500}}>VPN server</div>
          <div className="mono" style={{fontSize: 11, color: "var(--text-2)", marginTop: 2}}>
            {TENANT.vpsHost} · interface wg0 · port 51820 · 10.0.0.1/24
          </div>
        </div>
        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
          <span className="dot ok pulse"/>
          <span style={{fontSize: 12, color: "var(--ok)"}}>{connected} connected</span>
          <button className="btn sm ghost"><Icon.Plus size={11}/> Add peer</button>
        </div>
      </div>

      <table className="sec-table">
        <thead>
          <tr>
            <th>Peer</th>
            <th>Device</th>
            <th>Tunnel IP</th>
            <th>Status</th>
            <th>Last seen</th>
            <th>↓ RX</th>
            <th>↑ TX</th>
          </tr>
        </thead>
        <tbody>
          {VPN_PEERS.map(p => (
            <tr key={p.ip}>
              <td style={{fontWeight: 500, color: "var(--text-0)"}}>{p.name}</td>
              <td className="dim-cell">{p.device}</td>
              <td className="mono-cell">{p.ip}</td>
              <td>
                <div style={{display: "flex", alignItems: "center", gap: 6}}>
                  <span className={"dot " + (p.status === "connected" ? "ok pulse" : "")}/>
                  <span style={{fontSize: 11.5}}>{p.status}</span>
                </div>
              </td>
              <td className="mono-cell">{p.last}</td>
              <td className="mono-cell">{p.rx}</td>
              <td className="mono-cell">{p.tx}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AuditLogTab() {
  const [query, setQuery] = useStateSec("");
  const filtered = query
    ? AUDIT_ROWS.filter(r =>
        r.actor.toLowerCase().includes(query.toLowerCase()) ||
        r.verb.toLowerCase().includes(query.toLowerCase()) ||
        r.resource.toLowerCase().includes(query.toLowerCase())
      )
    : AUDIT_ROWS;

  return (
    <div className="sec-pane">
      <div className="sec-pane-head">
        <h2>Audit log</h2>
        <div className="sec-pane-sub">Every agent action, tool call, and system event — immutable, timestamped, actor-attributed.</div>
      </div>

      <div className="sec-audit-bar">
        <input
          className="sec-audit-search"
          placeholder="Filter by agent, action, resource…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="btn sm ghost"><Icon.Download size={11}/> Export CSV</button>
        <span className="mono" style={{fontSize: 10.5, color: "var(--text-3)", marginLeft: "auto"}}>
          {filtered.length} events
        </span>
      </div>

      <table className="sec-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Actor</th>
            <th>Action</th>
            <th>Resource</th>
            <th>Outcome</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => {
            const agent = AGENTS.find(a => a.name === row.actor);
            return (
              <tr key={i}>
                <td className="mono-cell">{row.t}</td>
                <td>
                  <div style={{display: "flex", alignItems: "center", gap: 7}}>
                    {agent
                      ? <AgentAvatar agent={agent} size={20}/>
                      : <div style={{width: 20, height: 20, borderRadius: 4, background: "var(--bg-3)", display: "grid", placeItems: "center"}}>
                          <Icon.Server size={10} style={{color: "var(--text-3)"}}/>
                        </div>
                    }
                    <span style={{fontSize: 12.5, color: agent ? agent.color : "var(--text-2)", fontWeight: 500}}>{row.actor}</span>
                  </div>
                </td>
                <td className="mono-cell">{row.verb}</td>
                <td style={{fontSize: 12, color: "var(--text-1)", maxWidth: 280}}>
                  <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block"}}>{row.resource}</span>
                </td>
                <td>
                  {row.outcome === "ok"      && <span className="tag ok"   style={{fontSize: 9}}>ok</span>}
                  {row.outcome === "pending" && <span className="tag warn" style={{fontSize: 9}}>pending</span>}
                  {row.outcome === "warn"    && <span className="tag warn" style={{fontSize: 9}}>warn</span>}
                  {row.outcome === "err"     && <span className="tag err"  style={{fontSize: 9}}>err</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AccessControlTab() {
  return (
    <div className="sec-pane">
      <div className="sec-pane-head">
        <h2>Access control</h2>
        <div className="sec-pane-sub">Which agents can call which tool categories. Gated tools require human approval before execution.</div>
      </div>

      <div className="sec-section">
        <div className="eyebrow" style={{marginBottom: 12}}>Agent tool permissions</div>
        <table className="sec-perm-table">
          <thead>
            <tr>
              <th style={{minWidth: 120}}>Agent</th>
              {PERM_COLS.map(c => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {AGENTS.map(agent => {
              const perms = PERM_DATA[agent.id] || PERM_COLS.map(() => "none");
              return (
                <tr key={agent.id}>
                  <td>
                    <div style={{display: "flex", alignItems: "center", gap: 8}}>
                      <AgentAvatar agent={agent} size={20}/>
                      <span style={{fontSize: 12.5, color: "var(--text-0)", fontWeight: 500}}>{agent.name}</span>
                    </div>
                  </td>
                  {perms.map((p, i) => (
                    <td key={i}>
                      <span className={"sec-perm-pill " + p}>
                        {p === "allow" ? "allow" : p === "gate" ? "gated" : "—"}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sec-section">
        <div className="eyebrow" style={{marginBottom: 12}}>Legend</div>
        <div style={{display: "flex", gap: 16}}>
          <div style={{display: "flex", alignItems: "center", gap: 7}}>
            <span className="sec-perm-pill allow">allow</span>
            <span style={{fontSize: 11.5, color: "var(--text-2)"}}>Agent can call tool autonomously</span>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 7}}>
            <span className="sec-perm-pill gate">gated</span>
            <span style={{fontSize: 11.5, color: "var(--text-2)"}}>Requires your approval before executing</span>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 7}}>
            <span className="sec-perm-pill none">—</span>
            <span style={{fontSize: 11.5, color: "var(--text-2)"}}>Tool not available to this agent</span>
          </div>
        </div>
      </div>

      <div className="sec-section">
        <div className="eyebrow" style={{marginBottom: 12}}>User RBAC</div>
        <table className="sec-perm-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>View agents</th>
              <th>Approve actions</th>
              <th>Edit workflows</th>
              <th>Manage integrations</th>
              <th>Admin settings</th>
            </tr>
          </thead>
          <tbody>
            {[
              { role: "Owner",  perms: ["allow","allow","allow","allow","allow"] },
              { role: "Admin",  perms: ["allow","allow","allow","allow","gate"]  },
              { role: "Member", perms: ["allow","none", "none", "none", "none"]  },
            ].map(row => (
              <tr key={row.role}>
                <td><span className="tag" style={{fontSize: 10}}>{row.role}</span></td>
                {row.perms.map((p, i) => (
                  <td key={i}>
                    <span className={"sec-perm-pill " + p}>
                      {p === "allow" ? "allow" : p === "gate" ? "gated" : "—"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { SecurityView });
