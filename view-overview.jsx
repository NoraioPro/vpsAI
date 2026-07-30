// Overview dashboard — at-a-glance metrics + recent activity.

function OverviewView({ onNav }) {
  return (
    <div className="overview">
      <div className="ov-hero card">
        <div className="ov-hero-left">
          <div className="eyebrow">Good morning, {USER.name.split(" ")[0]}</div>
          <h2 className="ov-hero-title">Your agents handled <span className="accent-text">147 tasks</span> overnight.</h2>
          <div className="ov-hero-sub">
            <span className="ov-hero-item"><Icon.Check size={13}/> 132 completed autonomously</span>
            <span className="ov-hero-item"><Icon.Clock size={13}/> 5 waiting on your approval</span>
            <span className="ov-hero-item"><Icon.X size={13}/> 2 blocked</span>
          </div>
          <div className="ov-hero-actions">
            <button className="btn primary" onClick={() => onNav("approvals")}>
              Review approvals
              <Icon.ArrowRight size={13}/>
            </button>
            <button className="btn" onClick={() => onNav("chat")}>
              <Icon.Chat size={13}/> Ask your business
            </button>
          </div>
        </div>
        <div className="ov-hero-right">
          <VpsHealth />
        </div>
      </div>

      <div className="ov-metrics">
        <Metric label="New leads · 14d" value="16" sub="+33%" data={SPARK.leads} color="var(--info)" />
        <Metric label="Revenue pipeline · 14d" value="NOK 224k" sub="+18%" data={SPARK.revenue} color="var(--ok)" />
        <Metric label="Agent actions · 14d" value="184" sub="+7%" data={SPARK.agents} color="var(--accent)" />
        <Metric label="Approval rate" value="94%" sub="↑ 2.1 pts" data={[82,84,85,83,86,88,89,91,92,91,93,94,94,94]} color="var(--warn)" />
      </div>

      <div className="ov-grid">
        <div className="card ov-agents">
          <div className="ov-card-head">
            <h3>Agents at a glance</h3>
            <button className="btn ghost sm" onClick={() => onNav("agents")}>
              Orchestrator <Icon.ArrowRight size={12}/>
            </button>
          </div>
          <div className="ov-agents-grid">
            {AGENTS.map(a => (
              <div key={a.id} className="ov-agent-row" onClick={() => onNav("agents")}>
                <AgentAvatar agent={a} size={30} />
                <div className="ov-agent-text">
                  <div className="ov-agent-name">{a.name} <span className="muted ov-agent-role">· {a.role}</span></div>
                  <div className="ov-agent-meta">
                    <span className={"dot " + (a.status === "active" ? "ok pulse" : a.status === "waiting" ? "warn" : a.status === "paused" ? "" : "info")}></span>
                    <span className="mono" style={{fontSize: 10.5}}>
                      {a.status === "active" ? "running" : a.status === "waiting" ? "waiting" : a.status === "paused" ? "paused" : "idle"}
                    </span>
                    <span className="dim" style={{marginLeft: 8, fontSize: 10.5}}>· {a.runs24h} runs · €{a.cost24h.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card ov-approvals">
          <div className="ov-card-head">
            <h3>Needs your approval</h3>
            <button className="btn ghost sm" onClick={() => onNav("approvals")}>
              All {APPROVALS.length} <Icon.ArrowRight size={12}/>
            </button>
          </div>
          <div className="ov-approvals-list">
            {APPROVALS.slice(0, 3).map(a => {
              const agent = AGENTS.find(x => x.name === a.agent);
              return (
                <div key={a.id} className="ov-approval" onClick={() => onNav("approvals")}>
                  <AgentAvatar agent={agent} size={26} />
                  <div className="ov-approval-body">
                    <div className="ov-approval-title">{a.title}</div>
                    <div className="ov-approval-sub">
                      <span className="tag">{a.kind}</span>
                      <span className="dim">{a.createdAt}</span>
                    </div>
                  </div>
                  <Icon.ArrowRight size={14} style={{color: "var(--text-3)"}}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function VpsHealth() {
  return (
    <div className="vps-health">
      <div className="vps-health-head">
        <div className="eyebrow">Your VPS</div>
        <span className="status-inline">
          <span className="dot ok pulse"></span>
          <span className="status-label" style={{color: "var(--ok)"}}>Healthy</span>
        </span>
      </div>
      <div className="vps-host mono">{TENANT.vpsHost}</div>
      <div className="vps-bars">
        <VpsBar label="CPU" value={14} />
        <VpsBar label="RAM" value={38} />
        <VpsBar label="Disk" value={23.6} />
        <VpsBar label="VPN" value={null} text={TENANT.users + " peers"} />
      </div>
    </div>
  );
}

function VpsBar({ label, value, text }) {
  return (
    <div className="vps-bar">
      <div className="vps-bar-head">
        <span className="vps-bar-label">{label}</span>
        <span className="mono vps-bar-val">{value != null ? value + "%" : text}</span>
      </div>
      {value != null ? (
        <div className="vps-bar-track">
          <div className="vps-bar-fill" style={{ width: value + "%" }}></div>
        </div>
      ) : (
        <div className="vps-bar-peers">
          {Array.from({length: 10}, (_, i) => (
            <span key={i} className={"vps-peer" + (i < 7 ? " on" : "")}></span>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { OverviewView });
