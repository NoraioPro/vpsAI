// App shell — sidebar nav + topbar.

const { useState, useEffect, useRef, useMemo } = React;

function Sidebar({ view, onNav }) {
  const nav = [
    { id: "home",      label: "Overview",  icon: Icon.Home },
    { id: "chat",      label: "AI Chat",   icon: Icon.Chat },
    { id: "agents",    label: "Agents",    icon: Icon.Agents, hero: true },
    { id: "approvals", label: "Approvals", icon: Icon.Approvals, badge: 5 },
    { id: "leads",     label: "Leads",     icon: Icon.Leads },
    { id: "content",   label: "Content",   icon: Icon.Content },
    { id: "flows",     label: "Workflows", icon: Icon.Flows },
    { id: "files",     label: "Knowledge", icon: Icon.Files },
  ];
  const foot = [
    { id: "security",  label: "Security",  icon: Icon.Shield },
    { id: "settings",  label: "Settings",  icon: Icon.Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-brand-mark">
          <HermesMark size={22} />
        </div>
        <div className="sb-brand-text">
          <div className="sb-brand-name">Hermes</div>
          <div className="sb-brand-sub">{TENANT.name}</div>
        </div>
        <div className="sb-brand-indicator" title="VPS healthy">
          <span className="dot ok pulse"></span>
        </div>
      </div>

      <div className="sb-tenant-strip">
        <div className="sb-tenant-cell">
          <div className="eyebrow">VPS</div>
          <div className="sb-tenant-val mono">{TENANT.vpsRegion}</div>
        </div>
        <div className="sb-tenant-cell">
          <div className="eyebrow">Plan</div>
          <div className="sb-tenant-val">{TENANT.plan}</div>
        </div>
      </div>

      <nav className="sb-nav">
        {nav.map(n => (
          <button
            key={n.id}
            className={"sb-item" + (view === n.id ? " active" : "") + (n.hero ? " hero" : "")}
            onClick={() => onNav(n.id)}
          >
            <n.icon size={15} />
            <span>{n.label}</span>
            {n.badge ? <span className="sb-badge">{n.badge}</span> : null}
            {view === n.id ? <span className="sb-active-bar"></span> : null}
          </button>
        ))}
      </nav>

      <div className="sb-divider"></div>

      <nav className="sb-nav">
        {foot.map(n => (
          <button
            key={n.id}
            className={"sb-item" + (view === n.id ? " active" : "")}
            onClick={() => onNav(n.id)}
          >
            <n.icon size={15} />
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-avatar">{USER.initials}</div>
          <div className="sb-user-text">
            <div className="sb-user-name">{USER.name}</div>
            <div className="sb-user-role">{USER.role}</div>
          </div>
          <button className="btn ghost sm" style={{padding:0, width:24}}><Icon.More size={14}/></button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, eyebrow, right, tabs, activeTab, onTab }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {eyebrow ? <div className="eyebrow topbar-eyebrow">{eyebrow}</div> : null}
        <h1 className="topbar-title">{title}</h1>
      </div>
      {tabs ? (
        <div className="topbar-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={"tb-tab" + (activeTab === t.id ? " active" : "")}
              onClick={() => onTab(t.id)}
            >
              {t.label}
              {t.count != null ? <span className="tb-tab-count">{t.count}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
      <div className="topbar-right">
        {right}
        <button className="btn ghost sm" style={{padding:0, width:28, height:28}} title="Notifications">
          <Icon.Bell size={15}/>
        </button>
        <button className="btn ghost sm" style={{padding:0, width:28, height:28}} title="Voice command">
          <Icon.Mic size={15}/>
        </button>
      </div>
    </header>
  );
}

function HermesMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18"/>
      <path d="M7 5c3 3 7 3 10 0"/>
      <path d="M8 9c2 2 6 2 8 0"/>
      <path d="M9 13c1.5 1.5 4.5 1.5 6 0"/>
      <path d="M5 3l2 2M19 3l-2 2"/>
    </svg>
  );
}

function Status({ kind, label, pulse }) {
  return (
    <span className="status-inline">
      <span className={"dot " + kind + (pulse ? " pulse" : "")}></span>
      <span className="status-label">{label}</span>
    </span>
  );
}

function Sparkline({ data, color = "var(--accent)", w = 140, h = 36, fill = true }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {fill ? <path d={area} fill={color} opacity="0.12" /> : null}
      <path d={path} stroke={color} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>
  );
}

function Metric({ label, value, sub, data, color }) {
  return (
    <div className="metric">
      <div className="metric-head">
        <div className="eyebrow">{label}</div>
        {sub ? <div className="metric-sub">{sub}</div> : null}
      </div>
      <div className="metric-value num">{value}</div>
      {data ? <Sparkline data={data} color={color} w={180} h={34} /> : null}
    </div>
  );
}

function AgentAvatar({ agent, size = 28 }) {
  const letter = agent.name ? agent.name[0] : "?";
  return (
    <div
      className="agent-avatar"
      style={{
        width: size,
        height: size,
        background: `color-mix(in oklab, ${agent.color} 18%, var(--bg-2))`,
        color: agent.color,
        borderColor: `color-mix(in oklab, ${agent.color} 35%, transparent)`,
        fontSize: size * 0.42,
      }}
    >
      {letter}
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, HermesMark, Status, Sparkline, Metric, AgentAvatar });
