// Settings — model config, integrations, infrastructure, team.

const { useState: useStateSt } = React;

const SETTINGS_TABS = [
  { id: "models",       label: "Models",         icon: "Sparkle"  },
  { id: "integrations", label: "Integrations",   icon: "Database" },
  { id: "infra",        label: "Infrastructure", icon: "Server"   },
  { id: "team",         label: "Team",           icon: "User"     },
];

const CONTAINERS = [
  { name: "hermes-api",  image: "fastapi:0.111",      status: "running", cpu: 4.2,  mem: 312,  uptime: "14d 6h" },
  { name: "hermes-ui",   image: "node:20-alpine",     status: "running", cpu: 0.8,  mem: 128,  uptime: "14d 6h" },
  { name: "ollama",      image: "ollama:latest",      status: "running", cpu: 12.4, mem: 8192, uptime: "14d 5h" },
  { name: "qdrant",      image: "qdrant/qdrant:v1.9", status: "running", cpu: 1.1,  mem: 256,  uptime: "14d 6h" },
  { name: "postgres",    image: "postgres:16",        status: "running", cpu: 0.6,  mem: 192,  uptime: "14d 6h" },
  { name: "minio",       image: "minio/minio",        status: "running", cpu: 0.3,  mem: 96,   uptime: "14d 6h" },
  { name: "n8n",         image: "n8nio/n8n:1.31",     status: "running", cpu: 0.9,  mem: 148,  uptime: "14d 6h" },
  { name: "traefik",     image: "traefik:v3.0",       status: "running", cpu: 0.2,  mem: 48,   uptime: "14d 6h" },
];

const TEAM_MEMBERS = [
  { name: "Ingrid Solberg",  email: "ingrid@fjordlys.no",  role: "Owner",  initials: "IS", status: "active"  },
  { name: "Erik Magnusson",  email: "erik@fjordlys.no",    role: "Admin",  initials: "EM", status: "active"  },
  { name: "Sofia Lindqvist", email: "sofia@fjordlys.no",   role: "Member", initials: "SL", status: "active"  },
  { name: "Thomas Haugen",   email: "thomas@fjordlys.no",  role: "Member", initials: "TH", status: "pending" },
];

const INTEGRATIONS_LIST = [
  { id: "nextcloud", label: "Nextcloud",    sub: "File storage · self-hosted on VPS",  icon: "Folder",   last: "12m ago", ver: "v28.0.4" },
  { id: "hubspot",   label: "HubSpot CRM",  sub: "CRM via HubSpot OAuth API",           icon: "Database", last: "5m ago",  ver: "API v3"  },
  { id: "fiken",     label: "Fiken",        sub: "Accounting API · read + write",       icon: "Building", last: "1h ago",  ver: "API v2"  },
  { id: "email",     label: "IMAP Email",   sub: "fjordlys.no · Dovecot on VPS",       icon: "Mail",     last: "2m ago",  ver: "IMAP4"   },
  { id: "n8n",       label: "n8n",          sub: "Workflow engine · self-hosted",       icon: "Flows",    last: "live",    ver: "1.31.2"  },
  { id: "website",   label: "fjordlys.no",  sub: "Website crawler · every 6 hours",    icon: "Globe",    last: "6h ago",  ver: "crawler" },
];

function SettingsView() {
  const [tab, setTab] = useStateSt("models");
  const [agentModels, setAgentModels] = useStateSt(
    () => Object.fromEntries(AGENTS.map(a => [a.id, a.model]))
  );

  return (
    <div className="settings">
      <div className="settings-nav">
        <div className="eyebrow" style={{padding: "0 16px 14px"}}>Settings</div>
        {SETTINGS_TABS.map(t => {
          const Ic = Icon[t.icon] || Icon.Settings;
          return (
            <button
              key={t.id}
              className={"settings-nav-item" + (tab === t.id ? " active" : "")}
              onClick={() => setTab(t.id)}
            >
              <Ic size={14}/>
              <span>{t.label}</span>
              {tab === t.id && <span className="sb-active-bar"/>}
            </button>
          );
        })}
      </div>

      <div className="settings-body">
        {tab === "models"       && <ModelsTab       agentModels={agentModels} onChange={(id, m) => setAgentModels(p => ({...p, [id]: m}))}/>}
        {tab === "integrations" && <IntegrationsTab />}
        {tab === "infra"        && <InfraTab        />}
        {tab === "team"         && <TeamTab         />}
      </div>
    </div>
  );
}

function ModelsTab({ agentModels, onChange }) {
  return (
    <div className="settings-pane">
      <div className="settings-pane-head">
        <h2>Model configuration</h2>
        <div className="settings-pane-sub">Assign AI models to each agent. Local models run on your VPS via Ollama — no data leaves your server.</div>
      </div>

      <div className="settings-section">
        <div className="eyebrow" style={{marginBottom: 14}}>Agent model assignments</div>
        {AGENTS.map(agent => {
          const modelId = agentModels[agent.id] || agent.model;
          return (
            <div key={agent.id} className="model-row">
              <div className="model-row-left">
                <AgentAvatar agent={agent} size={32}/>
                <div>
                  <div className="model-row-name">{agent.name}</div>
                  <div className="model-row-role">{agent.role}</div>
                </div>
              </div>
              <div className="model-row-right">
                <div className="model-picker">
                  {MODELS.map(m => (
                    <button
                      key={m.id}
                      className={"model-option" + (modelId === m.id ? " active" : "")}
                      onClick={() => onChange(agent.id, m.id)}
                      title={m.provider + (m.local ? " · local Ollama" : " · cloud API")}
                    >
                      <span className={"model-dot " + (m.local ? "local" : "cloud")}/>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="settings-section">
        <div className="eyebrow" style={{marginBottom: 12}}>Available models</div>
        <div className="settings-card">
          {MODELS.map((m, i) => (
            <div key={m.id} className={"model-info-row" + (i < MODELS.length - 1 ? " border-b" : "")}>
              <span className={"model-dot " + (m.local ? "local" : "cloud")} style={{flexShrink: 0}}/>
              <div style={{flex: 1}}>
                <div style={{fontSize: 12.5, color: "var(--text-0)", fontWeight: 500}}>{m.label}</div>
                <div style={{fontSize: 10.5, color: "var(--text-2)", marginTop: 1}}>
                  {m.provider} · {m.local ? "running on your VPS via Ollama" : "cloud API"}
                </div>
              </div>
              <div style={{display: "flex", gap: 5}}>
                {m.local  && <span className="tag ok"   style={{fontSize: 9}}>local</span>}
                {m.fast   && <span className="tag info" style={{fontSize: 9}}>fast</span>}
                {!m.local && <span className="tag"      style={{fontSize: 9}}>cloud</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  return (
    <div className="settings-pane">
      <div className="settings-pane-head">
        <h2>Integrations</h2>
        <div className="settings-pane-sub">Connected services that agents can read from and write to. All connections route through your VPS.</div>
      </div>

      <div className="settings-section">
        <div className="settings-card">
          {INTEGRATIONS_LIST.map((intg, i) => {
            const Ic = Icon[intg.icon] || Icon.Database;
            return (
              <div key={intg.id} className={"intg-row" + (i < INTEGRATIONS_LIST.length - 1 ? " border-b" : "")}>
                <div className="intg-icon"><Ic size={15}/></div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{display: "flex", alignItems: "center", gap: 8}}>
                    <span style={{fontSize: 13, color: "var(--text-0)", fontWeight: 500}}>{intg.label}</span>
                    <span className="tag ok" style={{fontSize: 9}}>connected</span>
                    <span className="mono" style={{fontSize: 9.5, color: "var(--text-3)", marginLeft: "auto"}}>last {intg.last}</span>
                  </div>
                  <div style={{fontSize: 11, color: "var(--text-2)", marginTop: 2}}>{intg.sub}</div>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: 8, flexShrink: 0}}>
                  <span className="mono" style={{fontSize: 10, color: "var(--text-3)"}}>{intg.ver}</span>
                  <button className="btn sm ghost"><Icon.Settings size={11}/></button>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn" style={{marginTop: 10}}>
          <Icon.Plus size={12}/> Add integration
        </button>
      </div>
    </div>
  );
}

function InfraTab() {
  return (
    <div className="settings-pane">
      <div className="settings-pane-head">
        <h2>Infrastructure</h2>
        <div className="settings-pane-sub">Hetzner VPS running Hermes and all services via Docker + Coolify. WireGuard VPN enforced.</div>
      </div>

      <div className="settings-section">
        <div className="eyebrow" style={{marginBottom: 12}}>VPS · {TENANT.vpsRegion}</div>
        <div className="settings-grid-4">
          {[
            { label: "CPU",    val: "14%",     fill: 14,   color: "var(--ok)"   },
            { label: "RAM",    val: "38%",     fill: 38,   color: "var(--ok)"   },
            { label: "Disk",   val: "23.6%",   fill: 23.6, color: "var(--info)" },
            { label: "Uptime", val: "14d 6h",  fill: null },
          ].map(s => (
            <div key={s.label} className="infra-stat">
              <div className="eyebrow">{s.label}</div>
              <div className="infra-stat-val">{s.val}</div>
              {s.fill != null
                ? <div className="infra-bar"><div className="infra-bar-fill" style={{width: s.fill+"%", background: s.color}}/></div>
                : <div style={{height: 3}}/>}
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12}}>
          <div className="eyebrow">Containers · {CONTAINERS.length} running</div>
          <span className="dot ok pulse"/>
        </div>
        <div className="settings-card">
          {CONTAINERS.map((c, i) => (
            <div key={c.name} className={"container-row" + (i < CONTAINERS.length - 1 ? " border-b" : "")}>
              <span className="dot ok" style={{flexShrink: 0}}/>
              <div style={{flex: 1, minWidth: 0}}>
                <span className="mono" style={{fontSize: 12.5, color: "var(--text-0)", fontWeight: 500}}>{c.name}</span>
                <span className="mono" style={{fontSize: 10, color: "var(--text-3)", marginLeft: 8}}>{c.image}</span>
              </div>
              <div className="container-meta">
                <span className="mono" style={{fontSize: 10, color: "var(--text-2)", minWidth: 52, textAlign: "right"}}>{c.cpu}% cpu</span>
                <span className="mono" style={{fontSize: 10, color: "var(--text-2)", minWidth: 56, textAlign: "right"}}>
                  {c.mem >= 1000 ? (c.mem/1024).toFixed(1)+"GB" : c.mem+"MB"}
                </span>
                <span className="mono" style={{fontSize: 10, color: "var(--text-3)", minWidth: 44, textAlign: "right"}}>↑{c.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="eyebrow" style={{marginBottom: 12}}>Security</div>
        <div className="settings-card">
          {[
            { icon: "VPN",    label: "WireGuard VPN",       sub: "14 peers connected · all traffic encrypted",                color: "var(--ok)",     tag: "active"  },
            { icon: "Shield", label: "Traefik TLS",         sub: "Auto-cert via Let's Encrypt · HTTPS on all services",       color: "var(--ok)",     tag: "active"  },
            { icon: "Lock",   label: "Encrypted backups",   sub: "Daily snapshot to Hetzner Object Storage · last 1h ago",    color: "var(--accent)", tag: "1h ago"  },
          ].map((row, i, arr) => {
            const Ic = Icon[row.icon] || Icon.Shield;
            return (
              <div key={row.label} className={"infra-security-row" + (i < arr.length - 1 ? " border-b" : "")}>
                <Ic size={14} style={{color: row.color, flexShrink: 0}}/>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 12.5, color: "var(--text-0)", fontWeight: 500}}>{row.label}</div>
                  <div style={{fontSize: 10.5, color: "var(--text-2)", marginTop: 1}}>{row.sub}</div>
                </div>
                <span className="tag ok" style={{fontSize: 9, flexShrink: 0}}>{row.tag}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TeamTab() {
  return (
    <div className="settings-pane">
      <div className="settings-pane-head">
        <h2>Team</h2>
        <div className="settings-pane-sub">Manage who can access Hermes and approve agent actions. Access is gated via WireGuard VPN.</div>
      </div>

      <div className="settings-section">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
          <div className="eyebrow">{TEAM_MEMBERS.length} members</div>
          <button className="btn sm primary"><Icon.Plus size={11}/> Invite</button>
        </div>
        <div className="settings-card">
          {TEAM_MEMBERS.map((m, i) => (
            <div key={m.email} className={"team-row" + (i < TEAM_MEMBERS.length - 1 ? " border-b" : "")}>
              <div className="team-avatar">{m.initials}</div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: "flex", alignItems: "center", gap: 8}}>
                  <span style={{fontSize: 13, color: "var(--text-0)", fontWeight: 500}}>{m.name}</span>
                  {m.status === "pending" && <span className="tag warn" style={{fontSize: 9}}>pending invite</span>}
                </div>
                <div style={{fontSize: 11, color: "var(--text-2)", marginTop: 1}}>{m.email}</div>
              </div>
              <div style={{display: "flex", alignItems: "center", gap: 8}}>
                <span className="tag" style={{fontSize: 10}}>{m.role}</span>
                <button className="btn sm ghost" style={{padding: "0 4px"}}><Icon.More size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="eyebrow" style={{marginBottom: 12}}>Tenant</div>
        <div className="settings-card">
          {[
            { label: "Company",     val: TENANT.name     },
            { label: "Org. nr",     val: TENANT.orgNr    },
            { label: "Domain",      val: TENANT.domain   },
            { label: "VPS host",    val: TENANT.vpsHost  },
            { label: "Plan",        val: TENANT.plan     },
          ].map((row, i, arr) => (
            <div key={row.label} style={{display: "flex", alignItems: "center", padding: "11px 16px", borderBottom: i < arr.length-1 ? "1px solid var(--line)" : 0}}>
              <span className="eyebrow" style={{minWidth: 100}}>{row.label}</span>
              <span className="mono" style={{fontSize: 12, color: "var(--text-0)"}}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SettingsView });
