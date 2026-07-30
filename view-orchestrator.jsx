// Agent Orchestrator — hero view.
// Constellation visualization: Hermes at center, sub-agents orbiting.

const { useState: useStateO, useEffect: useEffectO, useMemo: useMemoO } = React;

function OrchestratorView() {
  const [focused, setFocused] = useStateO("hermes");
  const [runningTick, setRunningTick] = useStateO(0);

  useEffectO(() => {
    const t = setInterval(() => setRunningTick(x => x + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const focusedAgent = AGENTS.find(a => a.id === focused) || AGENTS[0];

  return (
    <div className="orch">
      <div className="orch-left">
        <div className="orch-stage">
          <Constellation focused={focused} onFocus={setFocused} tick={runningTick} />
          <div className="orch-legend">
            <div className="orch-legend-item"><span className="dot ok pulse"></span> Running</div>
            <div className="orch-legend-item"><span className="dot warn"></span> Waiting on approval</div>
            <div className="orch-legend-item"><span className="dot info"></span> Idle</div>
            <div className="orch-legend-item"><span className="dot"></span> Paused</div>
          </div>
        </div>

        <AgentDetail agent={focusedAgent} />
      </div>

      <div className="orch-right">
        <ActivityStream />
      </div>
    </div>
  );
}

function Constellation({ focused, onFocus, tick }) {
  const W = 560, H = 440;
  const cx = W / 2, cy = H / 2;
  const R = 150;
  const subs = AGENTS.filter(a => a.id !== "hermes");
  const positions = useMemoO(() => {
    return subs.map((a, i) => {
      const angle = (-Math.PI / 2) + (i / subs.length) * Math.PI * 2;
      return { agent: a, x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R };
    });
  }, []);

  return (
    <div className="constellation" style={{ width: W, height: H }}>
      <svg className="constellation-svg" width={W} height={H}>
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={R} stroke="var(--line-2)" strokeWidth="1" fill="none" strokeDasharray="2 4" opacity="0.6"/>
        <circle cx={cx} cy={cy} r={R + 28} stroke="var(--line)" strokeWidth="1" fill="none" opacity="0.4"/>
        <circle cx={cx} cy={cy} r="100" fill="url(#hub-glow)" />

        {positions.map(({ agent, x, y }) => {
          const active = agent.status === "active";
          const waiting = agent.status === "waiting";
          const paused = agent.status === "paused";
          return (
            <g key={agent.id}>
              <line
                x1={cx} y1={cy}
                x2={x} y2={y}
                stroke={active ? agent.color : "var(--line-2)"}
                strokeWidth={active ? "1.3" : "1"}
                opacity={paused ? 0.25 : (active ? 0.75 : 0.5)}
                strokeDasharray={waiting ? "3 3" : undefined}
              />
              {active && (
                <circle r="3" fill={agent.color}>
                  <animateMotion dur={(3 + (agent.id.charCodeAt(0) % 4) * 0.4) + "s"} repeatCount="indefinite" path={`M${cx} ${cy} L${x} ${y}`} />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      <button
        className={"c-node c-hub" + (focused === "hermes" ? " focused" : "")}
        style={{ left: cx, top: cy }}
        onClick={() => onFocus("hermes")}
      >
        <div className="c-hub-ring"></div>
        <div className="c-hub-inner">
          <HermesMark size={28} />
        </div>
        <div className="c-hub-label">
          <div className="c-hub-name">Hermes</div>
          <div className="c-hub-sub eyebrow">orchestrator</div>
        </div>
      </button>

      {positions.map(({ agent, x, y }) => (
        <button
          key={agent.id}
          className={"c-node c-sub" + (focused === agent.id ? " focused" : "") + " status-" + agent.status}
          style={{ left: x, top: y }}
          onClick={() => onFocus(agent.id)}
        >
          <div className="c-sub-inner" style={{
            background: `color-mix(in oklab, ${agent.color} 18%, var(--bg-2))`,
            borderColor: agent.color,
            color: agent.color,
          }}>
            <span className="c-sub-letter">{agent.name[0]}</span>
            {agent.status === "active" && <span className="c-sub-pulse" style={{ background: agent.color }}></span>}
          </div>
          <div className="c-sub-label">
            <div className="c-sub-name">{agent.name}</div>
            <div className="c-sub-role">{agent.role}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function AgentDetail({ agent }) {
  const isHermes = agent.id === "hermes";
  const tools = {
    hermes:     ["router", "memory", "approval-gate", "audit-log", "scheduler"],
    marketing:  ["instagram.post", "linkedin.post", "campaign.plan", "analytics.read"],
    sales:      ["hubspot.crm", "email.send*", "lead.score", "proposal.draft"],
    content:    ["wordpress.publish*", "image.brief", "seo.analyze", "newsletter.draft"],
    research:   ["web.search", "competitor.track", "pdf.extract", "summary.write"],
    accounting: ["fiken.read", "invoice.parse", "expense.categorize", "report.weekly"],
    ads:        ["google-ads.adjust*", "meta-ads.adjust*", "roas.monitor"],
    support:    ["helpscout.read", "email.reply*", "ticket.route"],
  }[agent.id] || [];

  const model = MODELS.find(m => m.id === agent.model);

  return (
    <div className="agent-detail card">
      <div className="ad-head">
        <div className="ad-head-left">
          <AgentAvatar agent={agent} size={42} />
          <div>
            <div className="ad-name">{agent.name}</div>
            <div className="ad-role">{agent.role} {isHermes ? "· Orchestrator" : "agent"}</div>
          </div>
        </div>
        <div className="ad-head-right">
          <Status kind={statusKind(agent.status)} label={statusLabel(agent.status)} pulse={agent.status === "active"} />
          <button className="btn sm">{agent.status === "paused" ? <><Icon.Play size={12}/> Resume</> : <><Icon.Pause size={12}/> Pause</>}</button>
          <button className="btn sm ghost"><Icon.More size={14}/></button>
        </div>
      </div>

      <div className="ad-desc">{agent.desc}</div>

      <div className="ad-grid">
        <div className="ad-stat">
          <div className="eyebrow">Runs · 24h</div>
          <div className="ad-stat-val num">{agent.runs24h}</div>
        </div>
        <div className="ad-stat">
          <div className="eyebrow">Cost · 24h</div>
          <div className="ad-stat-val num">€{agent.cost24h.toFixed(2)}</div>
        </div>
        <div className="ad-stat">
          <div className="eyebrow">Approval rate</div>
          <div className="ad-stat-val num">{isHermes ? "—" : (78 + (agent.id.charCodeAt(0) % 18)) + "%"}</div>
        </div>
        <div className="ad-stat">
          <div className="eyebrow">Model</div>
          <div className="ad-stat-val mono" style={{fontSize: 13}}>{model ? model.label : agent.model}</div>
        </div>
      </div>

      <div className="ad-tools">
        <div className="eyebrow" style={{marginBottom: 8}}>Tools · {tools.length}</div>
        <div className="ad-tools-list">
          {tools.map(t => {
            const gated = t.endsWith("*");
            const label = gated ? t.slice(0, -1) : t;
            return (
              <span key={t} className={"ad-tool" + (gated ? " gated" : "")}>
                <span className="mono">{label}</span>
                {gated && <Icon.Lock size={10}/>}
              </span>
            );
          })}
        </div>
        <div className="ad-tools-foot">
          <Icon.Lock size={11}/>
          <span>Gated tools require human approval before executing.</span>
        </div>
      </div>
    </div>
  );
}

function ActivityStream() {
  return (
    <div className="activity card">
      <div className="activity-head">
        <div>
          <div className="eyebrow">Live</div>
          <h3 className="activity-title">Agent activity</h3>
        </div>
        <div className="activity-head-right">
          <span className="dot ok pulse"></span>
          <span className="activity-live">Streaming</span>
        </div>
      </div>

      <div className="activity-list">
        {ACTIVITY.map(a => {
          const agent = AGENTS.find(x => x.name === a.agent);
          return (
            <div key={a.id} className="activity-item">
              <div className="activity-time mono">{a.t}</div>
              <div className="activity-rail">
                <span className={"activity-dot " + (a.status === "pending-approval" ? "warn" : (a.status === "warn" ? "warn" : "ok"))}></span>
              </div>
              <div className="activity-body">
                <div className="activity-line">
                  <span className="activity-agent" style={{ color: agent?.color }}>{a.agent}</span>
                  <span className="muted"> {a.verb} </span>
                  <span>{a.obj}</span>
                </div>
                {a.status === "pending-approval" && (
                  <div className="activity-pending">
                    <Icon.Clock size={10}/> waiting for you
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function statusKind(s) {
  return s === "active" ? "ok" : s === "waiting" ? "warn" : s === "paused" ? "" : "info";
}
function statusLabel(s) {
  return s === "active" ? "Running" : s === "waiting" ? "Awaiting approval" : s === "paused" ? "Paused" : "Idle";
}

Object.assign(window, { OrchestratorView });
