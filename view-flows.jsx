// Workflows canvas — visual n8n-style workflow builder for Hermes orchestration.

const { useState: useStateF } = React;

const NODE_W = 148;
const NODE_H = 60;

const WORKFLOWS_DATA = [
  {
    id: "lead-nurture",
    name: "Lead Nurture Pipeline",
    desc: "Artemis · 3 agents",
    runs: 184,
    lastRun: "12m ago",
    avgDuration: "4m 12s",
    successRate: "97%",
    nodes: [
      { id: "n1", type: "trigger",   label: "New CRM lead",   sub: "HubSpot webhook",  icon: "Database", x: 40,  y: 110 },
      { id: "n2", type: "agent",     label: "Artemis",        sub: "Score & enrich",   icon: "Agents",   x: 240, y: 110, agent: "sales" },
      { id: "n3", type: "condition", label: "Score ≥ 70?",    sub: "Branch",           icon: "Sparkle",  x: 440, y: 110 },
      { id: "n4", type: "agent",     label: "Artemis",        sub: "Draft outreach",   icon: "Agents",   x: 640, y: 50,  agent: "sales" },
      { id: "n5", type: "gate",      label: "Approval gate",  sub: "Awaiting you",     icon: "Shield",   x: 640, y: 190 },
      { id: "n6", type: "action",    label: "email.send",     sub: "Send email",       icon: "Mail",     x: 840, y: 50  },
      { id: "n7", type: "action",    label: "CRM update",     sub: "Mark nurture",     icon: "Database", x: 840, y: 190 },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4", label: "Yes" },
      { from: "n3", to: "n5", label: "No" },
      { from: "n4", to: "n6" },
      { from: "n5", to: "n7" },
    ],
  },
  {
    id: "content-pipeline",
    name: "Content Calendar Pipeline",
    desc: "Calliope · Atlas · 2 agents",
    runs: 61,
    lastRun: "2h ago",
    avgDuration: "8m 47s",
    successRate: "100%",
    nodes: [
      { id: "n1", type: "trigger", label: "Schedule trigger", sub: "Every Mon 08:00", icon: "Clock",    x: 40,  y: 110 },
      { id: "n2", type: "agent",   label: "Calliope",         sub: "Draft content",   icon: "Agents",   x: 240, y: 110, agent: "marketing" },
      { id: "n3", type: "gate",    label: "Approval gate",    sub: "Awaiting you",    icon: "Shield",   x: 440, y: 110 },
      { id: "n4", type: "agent",   label: "Atlas",            sub: "Schedule post",   icon: "Agents",   x: 640, y: 110, agent: "ops" },
      { id: "n5", type: "action",  label: "instagram.post",   sub: "Publish",         icon: "Globe",    x: 840, y: 110 },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4", label: "Approved" },
      { from: "n4", to: "n5" },
    ],
  },
  {
    id: "invoice-reconcile",
    name: "Invoice Reconciliation",
    desc: "Midas · 1 agent",
    runs: 28,
    lastRun: "1d ago",
    avgDuration: "2m 08s",
    successRate: "93%",
    nodes: [
      { id: "n1", type: "trigger",   label: "Fiken webhook",   sub: "New invoice",    icon: "Building", x: 40,  y: 110 },
      { id: "n2", type: "agent",     label: "Midas",           sub: "Match & verify", icon: "Agents",   x: 240, y: 110, agent: "finance" },
      { id: "n3", type: "condition", label: "Matched?",        sub: "Branch",         icon: "Sparkle",  x: 440, y: 110 },
      { id: "n4", type: "action",    label: "fiken.mark_paid", sub: "Auto-reconcile", icon: "Check",    x: 640, y: 50  },
      { id: "n5", type: "gate",      label: "Approval gate",   sub: "Manual review",  icon: "Shield",   x: 640, y: 190 },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4", label: "Yes" },
      { from: "n3", to: "n5", label: "No" },
    ],
  },
];

const NODE_COLORS = {
  trigger:   { text: "var(--ok)",     avatarBg: "color-mix(in oklab, var(--ok) 18%, var(--bg-2))",     avatarBorder: "color-mix(in oklab, var(--ok) 35%, var(--bg-2))" },
  agent:     { text: "var(--accent)", avatarBg: "color-mix(in oklab, var(--accent) 18%, var(--bg-2))", avatarBorder: "color-mix(in oklab, var(--accent) 35%, var(--bg-2))" },
  condition: { text: "var(--info)",   avatarBg: "color-mix(in oklab, var(--info) 18%, var(--bg-2))",   avatarBorder: "color-mix(in oklab, var(--info) 35%, var(--bg-2))" },
  gate:      { text: "var(--warn)",   avatarBg: "color-mix(in oklab, var(--warn) 18%, var(--bg-2))",   avatarBorder: "color-mix(in oklab, var(--warn) 35%, var(--bg-2))" },
  action:    { text: "var(--text-2)", avatarBg: "var(--bg-3)",                                          avatarBorder: "var(--line-2)" },
};

function nodeColors(node) {
  if (node.agent) {
    const v = `var(--agent-${node.agent})`;
    return {
      text:         v,
      avatarBg:     `color-mix(in oklab, ${v} 18%, var(--bg-2))`,
      avatarBorder: `color-mix(in oklab, ${v} 35%, var(--bg-2))`,
    };
  }
  return NODE_COLORS[node.type] || NODE_COLORS.action;
}

function nodeInitial(node) {
  if (node.type === "agent")     return node.label.charAt(0);
  if (node.type === "trigger")   return "T";
  if (node.type === "condition") return "?";
  if (node.type === "gate")      return "!";
  return "→";
}

function WorkflowsView() {
  const [activeId, setActiveId] = useStateF(WORKFLOWS_DATA[0].id);
  const [focusedId, setFocusedId] = useStateF(null);

  const workflow = WORKFLOWS_DATA.find(w => w.id === activeId);

  const canvasW = Math.max(...workflow.nodes.map(n => n.x)) + NODE_W + 60;
  const canvasH = Math.max(...workflow.nodes.map(n => n.y)) + NODE_H + 60;

  function selectWorkflow(id) {
    setActiveId(id);
    setFocusedId(null);
  }

  function toggleNode(id) {
    setFocusedId(prev => prev === id ? null : id);
  }

  return (
    <div className="flows">
      <div className="flows-list">
        <div className="flows-list-head">
          <span className="eyebrow">Workflows</span>
          <button className="btn sm primary" style={{padding: "2px 8px"}}><Icon.Plus size={11}/></button>
        </div>

        {WORKFLOWS_DATA.map(w => (
          <button
            key={w.id}
            className={"flows-list-item" + (activeId === w.id ? " active" : "")}
            onClick={() => selectWorkflow(w.id)}
          >
            <div className="flows-list-item-row">
              <Icon.Flows size={13} style={{color: "var(--accent)", marginRight: 6, flexShrink: 0}}/>
              <span className="flows-list-name">{w.name}</span>
            </div>
            <div className="flows-list-meta">{w.desc}</div>
          </button>
        ))}

        <div className="flows-list-divider"/>

        <div style={{padding: "0 14px"}}>
          <div className="eyebrow" style={{marginBottom: 8}}>Templates</div>
          {["Email drip", "Social posting", "Weekly report", "Lead scoring"].map(t => (
            <button key={t} className="flows-template-item">
              <Icon.Plus size={11}/>{t}
            </button>
          ))}
        </div>
      </div>

      <div className="flows-canvas-wrap">
        <div className="flows-canvas-bar">
          <div>
            <div className="flows-canvas-title">{workflow.name}</div>
            <div className="flows-canvas-desc dim">
              {workflow.desc} · {workflow.runs} runs · last {workflow.lastRun}
            </div>
          </div>
          <div style={{display: "flex", gap: 8}}>
            <button className="btn sm ghost"><Icon.Pause size={12}/> Pause</button>
            <button className="btn sm primary"><Icon.Sparkle size={12}/> Run now</button>
          </div>
        </div>

        <div className="flows-canvas-scroll">
          <div className="flows-canvas" style={{width: canvasW, height: canvasH}}>
            <svg className="flows-edge-svg" width={canvasW} height={canvasH}>
              {workflow.edges.map((e, i) => {
                const from = workflow.nodes.find(n => n.id === e.from);
                const to   = workflow.nodes.find(n => n.id === e.to);
                if (!from || !to) return null;

                const x1 = from.x + NODE_W;
                const y1 = from.y + NODE_H / 2;
                const x2 = to.x;
                const y2 = to.y + NODE_H / 2;
                const cpx = Math.max(40, (x2 - x1) * 0.5);
                const d = `M ${x1} ${y1} C ${x1+cpx} ${y1} ${x2-cpx} ${y2} ${x2} ${y2}`;

                const isActive = from.type === "trigger" || from.type === "agent";
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2 - 2;

                const labelW = e.label ? e.label.length * 5.5 + 12 : 0;

                return (
                  <g key={i}>
                    <path className="flow-edge-shadow" d={d}/>
                    <path className={"flow-edge" + (isActive ? " flow-edge-active" : "")} d={d}/>
                    <polygon
                      className={"flow-edge-arrow" + (isActive ? " flow-edge-arrow-active" : "")}
                      points={`${x2},${y2} ${x2-7},${y2-4} ${x2-7},${y2+4}`}
                    />
                    {e.label && (
                      <g transform={`translate(${mx},${my})`}>
                        <rect x={-labelW/2} y={-8} width={labelW} height={14} rx={3} className="flow-edge-label-bg"/>
                        <text className="flow-edge-label-text" textAnchor="middle" dominantBaseline="middle" y={1}>
                          {e.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {workflow.nodes.map(node => (
              <FlowNode
                key={node.id}
                node={node}
                focused={focusedId === node.id}
                onClick={() => toggleNode(node.id)}
              />
            ))}
          </div>
        </div>

        <div className="flows-zoom">
          <button className="btn ghost sm" style={{padding: "0 5px", height: 24, fontSize: 15, lineHeight: 1}}>−</button>
          <span className="mono" style={{fontSize: 11, color: "var(--text-2)", minWidth: 34, textAlign: "center"}}>100%</span>
          <button className="btn ghost sm" style={{padding: "0 5px", height: 24, fontSize: 15, lineHeight: 1}}>+</button>
        </div>
      </div>

      <div className="flows-detail">
        {focusedId ? (
          <NodeDetail
            node={workflow.nodes.find(n => n.id === focusedId)}
            workflow={workflow}
            onClose={() => setFocusedId(null)}
          />
        ) : (
          <WorkflowStats workflow={workflow}/>
        )}
      </div>
    </div>
  );
}

function FlowNode({ node, focused, onClick }) {
  const col = nodeColors(node);
  const Ic = Icon[node.icon] || Icon.Sparkle;

  return (
    <div
      className={"flow-node" + (focused ? " focused" : "")}
      style={{
        left: node.x,
        top: node.y,
        width: NODE_W,
        height: NODE_H,
        background: "var(--bg-2)",
        borderColor: focused ? col.text : "var(--line-2)",
      }}
      onClick={onClick}
    >
      <div className="flow-node-left">
        <div
          className="flow-node-avatar"
          style={{background: col.avatarBg, borderColor: col.avatarBorder, color: col.text}}
        >
          {nodeInitial(node)}
        </div>
      </div>
      <div className="flow-node-body">
        <div className="flow-node-label">{node.label}</div>
        <div className="flow-node-sub">
          <Ic size={9} style={{marginRight: 3, flexShrink: 0, color: col.text}}/>
          {node.sub}
        </div>
      </div>
      {focused && (
        <div className="flow-node-focus-ring" style={{borderColor: col.text}}/>
      )}
    </div>
  );
}

function NodeDetail({ node, workflow, onClose }) {
  const col = nodeColors(node);
  const inEdges  = workflow.edges.filter(e => e.to   === node.id);
  const outEdges = workflow.edges.filter(e => e.from === node.id);
  const getLabel = id => workflow.nodes.find(n => n.id === id)?.label || id;

  const typeTagCls = { trigger: "ok", condition: "info", gate: "warn", agent: "", action: "" };

  return (
    <>
      <div className="flows-detail-head">
        <div style={{display: "flex", alignItems: "center", gap: 8}}>
          <div
            className="flow-node-avatar"
            style={{background: col.avatarBg, borderColor: col.avatarBorder, color: col.text, width: 28, height: 28, fontSize: 11}}
          >
            {nodeInitial(node)}
          </div>
          <div>
            <div className="flows-detail-title">{node.label}</div>
            <div style={{fontSize: 10.5, color: "var(--text-2)", marginTop: 2}}>{node.sub}</div>
          </div>
        </div>
        <button className="btn sm ghost" style={{padding: "2px 6px"}} onClick={onClose}>
          <Icon.X size={12}/>
        </button>
      </div>

      <div style={{marginTop: 8}}>
        <span className={"tag " + (typeTagCls[node.type] || "")}>{node.type}</span>
      </div>

      {node.type === "gate" && (
        <div className="flows-detail-gate">
          <Icon.Shield size={12}/>
          <span>Requires your approval before the agent can continue.</span>
        </div>
      )}

      <div className="flows-detail-io">
        {inEdges.length > 0 && (
          <div className="flows-detail-row">
            <div className="eyebrow">Receives from</div>
            {inEdges.map((e, i) => (
              <div key={i} style={{display: "flex", alignItems: "center", gap: 6, marginTop: 5}}>
                <Icon.Dot size={8} style={{color: "var(--text-3)", flexShrink: 0}}/>
                <span style={{fontSize: 11.5, color: "var(--text-1)", flex: 1}}>{getLabel(e.from)}</span>
                {e.label && <span className="tag" style={{fontSize: 9}}>{e.label}</span>}
              </div>
            ))}
          </div>
        )}
        {outEdges.length > 0 && (
          <div className="flows-detail-row">
            <div className="eyebrow">Sends to</div>
            {outEdges.map((e, i) => (
              <div key={i} style={{display: "flex", alignItems: "center", gap: 6, marginTop: 5}}>
                <Icon.Dot size={8} style={{color: "var(--text-3)", flexShrink: 0}}/>
                <span style={{fontSize: 11.5, color: "var(--text-1)", flex: 1}}>{getLabel(e.to)}</span>
                {e.label && <span className="tag" style={{fontSize: 9}}>{e.label}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function WorkflowStats({ workflow }) {
  return (
    <>
      <div className="flows-detail-head">
        <div style={{fontSize: 13, fontWeight: 500, color: "var(--text-0)"}}>{workflow.name}</div>
      </div>
      <div style={{fontSize: 11, color: "var(--text-2)", marginTop: 3}}>{workflow.desc}</div>

      <div className="flows-stats-grid">
        <div className="flows-stat">
          <div className="eyebrow">Total runs</div>
          <div className="flows-stat-val">{workflow.runs}</div>
        </div>
        <div className="flows-stat">
          <div className="eyebrow">Success</div>
          <div className="flows-stat-val">{workflow.successRate}</div>
        </div>
        <div className="flows-stat">
          <div className="eyebrow">Avg. time</div>
          <div className="flows-stat-val" style={{fontSize: 14}}>{workflow.avgDuration}</div>
        </div>
        <div className="flows-stat">
          <div className="eyebrow">Last run</div>
          <div className="flows-stat-val" style={{fontSize: 14}}>{workflow.lastRun}</div>
        </div>
      </div>

      <div style={{marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)"}}>
        <div className="eyebrow" style={{marginBottom: 8}}>Nodes · {workflow.nodes.length}</div>
        {workflow.nodes.map(node => {
          const col = nodeColors(node);
          return (
            <div key={node.id} style={{display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid var(--line)"}}>
              <span style={{width: 6, height: 6, borderRadius: "50%", background: col.text, flexShrink: 0, display: "block"}}/>
              <span style={{fontSize: 12, color: "var(--text-1)", flex: 1}}>{node.label}</span>
              <span className={"tag " + (NODE_COLORS[node.type] ? (node.type === "trigger" ? "ok" : node.type === "gate" ? "warn" : node.type === "condition" ? "info" : "") : "")} style={{fontSize: 9}}>
                {node.type}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{marginTop: 14, display: "flex", flexDirection: "column", gap: 6}}>
        <button className="btn sm" style={{width: "100%", justifyContent: "center"}}>
          <Icon.Settings size={11}/> Edit workflow
        </button>
        <button className="btn sm ghost" style={{width: "100%", justifyContent: "center"}}>
          <Icon.Download size={11}/> Export JSON
        </button>
      </div>
    </>
  );
}

Object.assign(window, { WorkflowsView });
